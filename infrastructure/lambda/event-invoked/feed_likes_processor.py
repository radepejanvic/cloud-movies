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
                continue

            new = record['dynamodb']['NewImage']
            movie = get_movie(new['directory'])

            response = sqs.send_message(
                QueueUrl=queue_url,
                MessageBody=json.dumps({
                    'userId': new['userId']['S'], 
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
    new = record['dynamodb']['NewImage']

    if record['eventName'] == 'INSERT': 
        return 1 if new['liked'] else -1
    
    old = record['dynamodb']['OldImage']
    if record['eventName'] == 'REMOVE': 
        return -1 if old['liked'] else 1
    
    if new['liked']: 
        return 2 
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