import json

def calculator(event, context):
    print("hello world")
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        "body" : json.dumps("hello daniel zhang")
    }