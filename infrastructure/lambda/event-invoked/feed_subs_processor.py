import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
sqs = boto3.client('sqs')

likes_table = os.environ['SUBSCRIPTIONS_TABLE']
queue_url = os.environ['QUEUE_URL']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):

    logging.info(event['Records'])

    try: 
        for record in event['Records']: 
            if record['eventName'] == 'REMOVE':
                continue

            if record['eventName'] == 'MODIFY': 
                new = record['dynamodb']['NewImage']
                old = record['dynamodb']['OldImage']
                added, removed = get_diff(old, new)
                if added: send_message(new['userId']['S'], added, 5)
                if removed: send_message(new['userId']['S'], removed, -5)

            else: 
                new = record['dynamodb']['NewImage']
                if new: send_message(new['userId']['S'], new['topics']['SS'], 5)
            
    except Exception as e: 
        logging.error(e)


def get_diff(old, new):

    added = list(set(new['topics']['SS']) - set(old['topics']['SS']))
    removed = list(set(old['topics']['SS']) - set(new['topics']['SS']))

    logging.info(added)
    logging.info(removed)

    return added, removed


def send_message(user_id, topics, points): 
    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps({
            'userId': user_id,
            'categories': topics, 
            'points': points,
            'sender': 'subs_processor'
        })
    )

    logging.info(f'SQS: {response}')
