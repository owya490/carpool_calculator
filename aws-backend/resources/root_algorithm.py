import json
import geocoder
import math

from Person import Passenger, Driver
from math_functions import MathematicalGenius

class RootAlgorithm:
    passenger_list = []
    driver_list = []
    def __init__(self, json_data_string) -> None:
        # ensure class variables are NOT static
        self.passenger_list = []
        self.driver_list = []

        # initialise list
        self.process_json_data(json_data_string)
        # populate the driver_list of passengers
        self.initial_populate_driver_list_of_each_passenger()

        # order passenger by largest delta between first two drivers
        self.order_passengers_by_largest_delta()

        # execute assignment of passengers to drivers
        self.assign_passengers_to_driver()

        # apply tsp to order passenger lists in each driver
        # for driver in self.driver_list:
        #     driver.apply_tsp()

    
    # helper function for init
    def process_json_data(self, json_data_string):
        # populates passenger and driver lists
        python_json_data = json.loads(json_data_string)

        # append to passenger_list
        json_data_passengers_list = python_json_data['passengers']
        for json_passenger_object in json_data_passengers_list:
            passenger_name = json_passenger_object['name']
            passenger_location_string = json_passenger_object['location']

            passenger_location = self.convert_location_string_to_coords(passenger_location_string)
            self.passenger_list.append(Passenger(passenger_name, passenger_location))

        # append to driver_list
        json_data_drivers_list = python_json_data['drivers']
        for json_driver_object in json_data_drivers_list:
            driver_name = json_driver_object['name']
            driver_location_string = json_driver_object['location']
            driver_location = self.convert_location_string_to_coords(driver_location_string)
            driver_seats = json_driver_object['seats']
            driver_destination_string = json_driver_object['destination']
            driver_destination = self.convert_location_string_to_coords(driver_destination_string)
            self.driver_list.append(Driver(driver_name, driver_location, driver_seats, driver_destination))
        
    # helper function for process_json_data
    def convert_location_string_to_coords(self, location_string):
        g = geocoder.osm(location_string)
        return [g.lat, g.lng]
    
    # helper function for init
    def initial_populate_driver_list_of_each_passenger(self):
        for passenger in self.passenger_list:
            passenger.initial_populate_driver_list(self.driver_list)
    
    def order_passengers_by_largest_delta(self):
        self.passenger_list = sorted(self.passenger_list, key=lambda passenger: passenger.get_delta_val())
        self.passenger_list.reverse()
    
    # precondition - every driver in each passenger's driver_list still has space
    def assign_passengers_to_driver(self):
        while len(self.passenger_list) > 0:
            curr_passenger = self.passenger_list.pop(0)
            first_driver = curr_passenger.get_first_driver()

            # add the curr_passenger to the their first_driver passenger list
            first_driver.add_passenger_to_list(curr_passenger)
            
            # perform appropriate updates if driver became full from adding passenger
            if not first_driver.can_add_passenger():
                for passenger in self.passenger_list:
                    # remove driver from passenger driver_list
                    passenger.remove_driver_from_driver_distance_tuple_list(first_driver)

                    # update each passenger's delta_val
                    passenger.update_delta()

                # recalculate the ordering of root_algo passenger_list according to each passenger's delta_val
                self.order_passengers_by_largest_delta()
    
    def get_driver_list(self):
        return self.driver_list


def main():
    json_string = ''
    with open('./test/carpool_test_1.json', 'r') as json_file:
        json_string = json_file.read()

    root_algorithm = RootAlgorithm(json_string)
    for driver in root_algorithm.driver_list:
        passenger_list = driver.driver_passenger_list
        for passenger in passenger_list:
            print('driver', driver.name)
            print('passenger', passenger.name)
            print("passenger", passenger.location)
    return 


if __name__ == '__main__':
    main()

