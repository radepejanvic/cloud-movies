import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
sqs = boto3.client('sqs')

likes_table = os.environ['HISTORY_TABLE']
metadata_table = os.environ['METADATA_TABLE']
queue_url = os.environ['QUEUE_URL']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):

    logging.info(event['Records'])

    try: 
        for record in event['Records']: 
            if not record['eventName'] == 'INSERT':
                continue
            else: 
                image = record['dynamodb']['NewImage']
            
            categories = get_categories(image['movie'])
            if not categories: 
                return
            
            response = sqs.send_message(
                QueueUrl=queue_url,
                MessageBody=json.dumps({
                    'userId': image['userId']['S'], 
                    'categories': list(categories),
                    'points': 2,
                    'sender': 'history_processor'
                })
            )
            logging.info(f'SQS: {response}')

    except Exception as e: 
        logging.error(e)


def get_categories(directory): 
    response = dynamodb.query(
        TableName=metadata_table,
        KeyConditionExpression='directory = :directory',
        FilterExpression='attribute_exists(title)',
        ExpressionAttributeValues={
            ':directory': directory,
        }
    )
    logging.info(response)

    items = response.get('Items', [])
    logging.info(f'Item: {items}')

    if not items:
        return []

    return parse_categories(items[0])


def parse_categories(movie):
    categories = set()

    # TODO: Concatenate strings before splitting
    if movie['actors']['S']: categories.update(movie['actors']['S'].split(','))
    if movie['directors']['S']: categories.update(movie['directors']['S'].split(','))
    if movie['genres']['S']: categories.update(movie['genres']['S'].split(','))
    
    return categories