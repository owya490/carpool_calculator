import json, pprint, geocoder, requests

class Person:
    def __init__(self, name, address, if_driver, seats):
        self.name = name
        self.address = address
        self.if_driver = if_driver
        self.seats = seats
        self.x_coord = None
        self.y_coord = None

    def set_coords(self, x_coord, y_coord):
        self.x_coord = x_coord
        self.y_coord = y_coord

    def __str__(self):
        return f"{self.name} is located at x: {self.x_coord} and y: {self.y_coord}"

people_list = []
json_file = open("resources/json_input.json")
input = json.load(json_file)

for people_type in input["body"]:
    for person in input["body"][people_type]:
        g = geocoder.google(person["location"], key='AIzaSyB3XCcu8QgmfZR351yqNwZE6NO5-BSeiH4')
        new_person = None
        if people_type == "drivers":
            new_person = Person(person["name"], person["location"], True, person["seats"])
        else:
            new_person = Person(person["name"], person["location"], False, None)
        new_person.set_coords(g.lng, g.lng)
        people_list.append(new_person)


if __name__ == "__main__":
    for people in people_list:
        print(people)