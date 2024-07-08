import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
table_name = os.environ['SUBSCRIPTIONS_TABLE']
sns = boto3.client('sns')
region = os.environ["REGION"]
account = os.environ["ACCOUNT_ID"]

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    
    try: 
        logging.info(event)
        new = {}
        for record in event['Records']: 

            if record['eventName'] == 'INSERT': 
                new = record['dynamodb']['NewImage']
                
                logging.info(new)
                subscribe(new, new['email']['S'])

            elif record['eventName'] == 'MODIFY':
                new = record['dynamodb']['NewImage']
                old = record['dynamodb']['OldImage']

                logging.info(new)
                logging.info(old)

                added, removed = get_diff(old, new)
                subscribe(added, new['email']['S'])
                unsubscribe(removed)

    except Exception as e: 
        logging.error(e)


def subscribe(image, email):
    for item in image.get('topics', {}).get('SS', []): 
        if item == ' ': continue

        logging.info(normalize(item))

        response = sns.subscribe(
            TopicArn=f'arn:aws:sns:{region}:{account}:{normalize(item)}',
            Protocol='email',
            Endpoint=email
        )

        logging.info(response)


def unsubscribe(image): 
    for item in image.get('topics', {}).get('SS', []): 
        response = sns.list_topics()
        topic_arn = f'arn:aws:sns:{region}:{account}:{normalize(item)}'
        
        logging.warning(f'response: {type(response)}')

        for topic in response['Topics']:
            if topic['TopicArn'] == topic_arn:
                subscriptions = sns.list_subscriptions_by_topic(TopicArn=topic_arn)

                logging.warning(f'subscription_arn: {type(subscriptions)}')
                logging.info(subscriptions)

                for subscription in subscriptions['Subscriptions']:

                    logging.warning(f'subscription: {type(subscription)}')
                    logging.info(subscription)

                    if subscription['SubscriptionArn'] == 'PendingConfirmation': 
                        continue

                    try: 
                        response = sns.unsubscribe(
                            SubscriptionArn=subscription['SubscriptionArn']
                        )
                    except Exception as e: 
                        logging.error(f'Error: {str(e)}')
                        continue

                    logging.info(response)



def get_diff(old, new):

    added = {'topics': {'SS': set(new['topics']['SS']) - set(old['topics']['SS'])}}
    removed = {'topics': {'SS': set(old['topics']['SS']) - set(new['topics']['SS'])}}

    logging.warning(added)
    logging.warning(removed)

    return added, removed

def normalize(input): 
    return input.strip().replace(' ', '_').lower()
