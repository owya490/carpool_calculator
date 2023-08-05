from math_functions import MathematicalGenius
import numpy as np
from python_tsp.exact import solve_tsp_dynamic_programming
from scipy.spatial import distance_matrix
from scipy.optimize import linear_sum_assignment


class Person:
    def __init__(self, name, location):
        self.name = name
        self.location= location
    
    def get_name(self):
        return self.name
    
    def get_location(self):
        return self.location
    
class Passenger(Person):
    driver_distance_tuple_list = [] # (Driver, distance)
    delta_val = 0

    def __init__(self, name, location):
        super().__init__(name, location)
        self.driver_distance_tuple_list = []
        self.delta_val = 0

    def get_driver_distance_tuple_list(self):
        return self.driver_distance_tuple_list

    def update_delta(self):
        self.delta_val = self.calculate_delta()

    # helper function for update_delta
    def calculate_delta(self):
        delta_val = 0
        if len(self.driver_distance_tuple_list) >= 2:
            first_driver_distance = self.driver_distance_tuple_list[0][1]
            second_driver_distance = self.driver_distance_tuple_list[1][1]
            delta_val = abs(second_driver_distance - first_driver_distance)
        else:
            delta_val = 0
        return delta_val

    def get_first_driver(self):
        return self.driver_distance_tuple_list[0][0]

    def remove_driver_from_driver_distance_tuple_list(self, driver_to_remove):
        index_of_driver_to_remove = -1
        for driver, distance in self.driver_distance_tuple_list:
            # TODO: make more robust object comparison method than '=='
            if driver == driver_to_remove:
                index_of_driver_to_remove = self.driver_distance_tuple_list.index((driver, distance))
                break
        
        # if driver_to_remove does NOT exist as part of a tuple in the driver_distance_tuple_list
        if index_of_driver_to_remove == -1:
            return
        
        self.driver_distance_tuple_list.pop(index_of_driver_to_remove)

    
    def order_drivers(self, unordered_driver_list):
        pass

    def get_delta_val(self):
        return self.delta_val
    
    def initial_populate_driver_list(self, driver_list):
        for driver in driver_list:
            # get straight line from driver to their destination
            driver_dest_a, driver_dest_b, driver_dest_c = MathematicalGenius.find_line_between_two_points(driver.get_location(), driver.get_destination())

            # get relevant line variables
            driver_normal_a, driver_normal_b, driver_normal_c = MathematicalGenius.find_normal_to_line_at_point(driver_dest_a, driver_dest_b, driver_dest_c, driver.get_location())
            dest_normal_a, dest_normal_b, dest_normal_c = MathematicalGenius.find_normal_to_line_at_point(driver_dest_a, driver_dest_b, driver_dest_c, driver.get_destination())
            
            # check whether we take perpendicular or straight line distance
            if MathematicalGenius.is_point_between_lines(driver_normal_a, driver_normal_b, driver_normal_c, dest_normal_a, dest_normal_b, dest_normal_c, self.get_location()):
                # get perpendicular distance
                self.driver_distance_tuple_list.append((driver, MathematicalGenius.perpendicular_distance(driver_dest_a, driver_dest_b, driver_dest_c, driver.get_location())))
                print("is between lines " + self.get_name() + " " + driver.get_name())
            else:
                # get straight line distance
                self.driver_distance_tuple_list.append((driver, MathematicalGenius.pythagoris(self.get_location(), driver.get_location())))
        self.driver_distance_tuple_list.sort(key=lambda driver_list_tuple: driver_list_tuple[1])

        # then set INITIAL delta_val
        self.update_delta()
        

        
class Driver(Person):
    driver_passenger_list = []
    num_seats = 0
    destination = [0, 0]
    def __init__(self, name, location, num_seats, destination):
        super().__init__(name, location)
        self.driver_passenger_list = []
        self.num_seats = num_seats
        self.destination = destination

    def can_add_passenger(self):
        return len(self.driver_passenger_list) < self.num_seats - 1
    
    def add_passenger_to_list(self, passenger):
        self.driver_passenger_list.append(passenger)

    def get_destination(self):
        return self.destination
    
    def make_passenger_location_list(self):
        passengers = []
        for passenger in self.driver_passenger_list:
            passengers.append(passenger.get_location())
        return passengers

    def apply_tsp(self):
        location_coord_list = [self.location] + self.make_passenger_location_list + [self.destination]
        
        dist_matrix = distance_matrix(location_coord_list, location_coord_list)

        # Use linear sum assignment to solve the TSP (minimize total distance)
        row_ind, col_ind = linear_sum_assignment(dist_matrix)

        # Reorder the coordinates and objects based on the optimal assignment
        ordered_location_coord_list = [location_coord_list[i] for i in col_ind]
        ordered_driver_passenger_list = [self.driver_passenger_list[i] for i in col_ind]
        self.driver_passenger_list = ordered_driver_passenger_list
