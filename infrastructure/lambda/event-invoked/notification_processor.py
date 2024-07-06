import boto3 # type: ignore
import json
import os
import logging 

sns_client = boto3.client('sns')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):

    try: 
        for record in event['Records']: 
            if not record['eventName'] == 'MODIFY': 
                continue

            new_movie = record['dynamodb']['NewImage']

            if not new_movie['uploaded'].values():
                continue

            new_movie = record['dynamodb']['NewImage']
            genres = new_movie.get('genres', {}).get('S', '').split(',')
            directors = new_movie.get('directors', {}).get('S', '').split(',')
            actors = new_movie.get('actors', {}).get('S', '').split(',')

            topics = set(genres + directors + actors)

            publish_notifications(topics, construct_message(new_movie))
    except Exception as e: 
        logging.error(e)


def publish_notifications(topics, message):
    for topic in topics:
        topic_arn = get_or_create_topic_arn(normalize(topic))
    
        response = sns_client.publish(
            TopicArn=topic_arn,
            Message=message,
            Subject='New Movie Notification',
        )

        logging.info(response)
        logging.info(f"Published notification: {message} to {topic_arn}")


def get_or_create_topic_arn(topic_name):
    response = sns_client.list_topics()
    
    for topic in response['Topics']:
        if topic_name in topic['TopicArn']:
            return topic['TopicArn']
    
    create_response = sns_client.create_topic(Name=topic_name)
    return create_response['TopicArn']


def normalize(input): 
    return input.strip().replace(' ', '_').lower()


def construct_message(new_movie):

    title = new_movie.get('title', {}).get('S')
    desc = new_movie.get('description', {}).get('S')
    genres = new_movie.get('genres', {}).get('S')
    directors = new_movie.get('directors', {}).get('S')
    actors = new_movie.get('actors', {}).get('S')

    message = '''
        Movie: {title}, 
        Description: {desc}, 
        Genres: {genres}, 
        Directors: {directors}, 
        Actors: {actors}
    '''
    return message.format(title=title, desc=desc, genres=genres, directors=directors, actors=actors)