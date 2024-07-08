import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
sqs = boto3.client('sqs')

likes_table = os.environ['LIKES_TABLE']
metadata_table = os.environ['METADATA_TABLE']
queue_url = os.environ['QUEUE_URL']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):

    logging.info(event['Records'])

    try: 
        for record in event['Records']: 

            if record['eventName'] == 'REMOVE':
                image = record['dynamodb']['OldImage']
            else: 
                image = record['dynamodb']['NewImage']
            movie = get_movie(image['directory'])

            response = sqs.send_message(
                QueueUrl=queue_url,
                MessageBody=json.dumps({
                    'userId': image['userId']['S'], 
                    'actors': movie['actors'],
                    'directors': movie['directors'],
                    'genres': movie['genres'],
                    'points': get_points(record),
                    'sender': 'likes_processor'
                })
            )

            logging.info(f'SQS: {response}')

    except Exception as e: 
        logging.error(e)


def get_points(record):
    if record['eventName'] == 'INSERT': 
        new = record['dynamodb']['NewImage']
        return 1 if new['liked']['BOOL'] else -1
    
    if record['eventName'] == 'REMOVE':
        old = record['dynamodb']['OldImage']
        return -1 if old['liked']['BOOL'] else 1
    
    new = record['dynamodb']['NewImage']
    old = record['dynamodb']['OldImage']
    
    if new['liked']['BOOL'] and not old['liked']['BOOL']: 
        return 2 
    elif not new['liked']['BOOL'] and old['liked']['BOOL']: 
        return -2


def get_movie(directory): 
    response = dynamodb.query(
        TableName=metadata_table,
        KeyConditionExpression='directory = :directory',
        FilterExpression='attribute_exists(title)',
        ExpressionAttributeValues={
            ':directory': directory,
        }
    )

    logging.info(response)

    item = response['Items'][0]
    logging.info(f'Item: {item}')

    if not item:
        return None
    
    movie = {
        'actors': item['actors']['S'].split(','), 
        'directors': item['actors']['S'].split(','), 
        'genres': item['genres']['S'].split(',')
    }

    return movie