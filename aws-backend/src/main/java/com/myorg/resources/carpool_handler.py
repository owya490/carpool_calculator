import json

from resources.root_algorithm import RootAlgorithm

def calculator(event, context):
    print("hello world")
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        "body" : json.dumps(construct_json_response())
    }

def construct_json_response():
    root_algorithm = RootAlgorithm()
    driver_list = root_algorithm.get_driver_list()

    response_json_data_list = []

    for driver in driver_list:
        curr_driver_passenger_list = []
        passenger_list = driver.get_driver_passenger_list()
        for passenger in passenger_list:
            passenger_json_data = {
                "name": passenger.get_name(),
                "location": {
                    "address": passenger.get_address(),
                    "lat": passenger.get_location()[0],
                    "lng": passenger.get_location()[1]
                }
            }
            curr_driver_passenger_list.append(passenger_json_data)

        list_object_element = {
            "driver": {
                "name": driver.get_name(),
                "location": {
                    "address": driver.get_address(),
                    "lat": driver.get_location()[0],
                    "lng": driver.get_location()[1]
                },
                "destination": {
                    "address": driver.get_destination_address(),
                    "lat": driver.get_destination()[0],
                    "lng": driver.get_destination()[1]
                }
            },
            "passengers": curr_driver_passenger_list
        }

        response_json_data_list.append(list_object_element)

    return {"result": response_json_data_list}
