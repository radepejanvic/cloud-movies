import json
import boto3 # type: ignore
import os
import logging
from datetime import datetime

dynamodb = boto3.client('dynamodb')
feed_table = os.environ['FEED_TABLE']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):

    try: 
        for record in event['Records']:
            message = json.loads(record['body'])
            # message = record['body']
            keys = get_keys(message)
            logging.info(keys)

            existing_keys = check_existing_items(keys)
            new_keys = keys - existing_keys

            if new_keys: 
                write_new_items(new_keys, message['points'])
                
            if existing_keys: 
                update_existing_items(existing_keys, message['points'])

    except Exception as e: 
        print('Error', e)


def get_keys(message): 
    # Maybe remove these categories completely
    categories = ['actors', 'directors', 'genres']

    keys = set(
        # (message['userId'], f'{category[0]}_{item}')
        (message['userId'], item)
        for category in categories
        for item in message[category]
    )

    return keys


def check_existing_items(keys):
    response = dynamodb.batch_get_item(
    RequestItems={
        feed_table: {
            'Keys': [{'userId': {'S': user_id}, 'category': {'S': category}} for user_id, category in keys]
        }
    })

    logging.info(response)

    existing_keys = set()
    for item in response['Responses'][feed_table]:
        existing_keys.add((item['userId']['S'], item['category']['S']))

    return existing_keys


def update_existing_items(keys, points): 
    operation = "+" if points > 0 else "-"
    for user_id, category in keys: 
        response = dynamodb.update_item(
            TableName=feed_table,
            Key={
                'userId': {'S': user_id},
                'category': {'S': category}
            },
            UpdateExpression=f'SET points = points {operation} :inc, relevance = :relevance',
            ExpressionAttributeValues={
                ':inc': {'N': str(points)}, 
                ':relevance': {'S': datetime.utcnow().isoformat()}
            }
        )
        
        logging.info(response)


def write_new_items(keys, points):
    items = [
        {
            'PutRequest': {
                'Item': {
                    'userId': {'S': user_id},
                    'category': {'S': category},
                    'points': {'N': str(points)}, 
                    'relevance': {'S': datetime.utcnow().isoformat()}
                }
            }
        }
        for user_id, category in keys
    ]

    logging.info(f'Batch write items: {items}')

    response = dynamodb.batch_write_item(
        RequestItems={
            feed_table: items
        }
    )

    logging.info(f'Batch write response: {response}')