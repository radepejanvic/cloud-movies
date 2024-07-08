import boto3 # type: ignore
import json
import os
import logging 
from datetime import datetime

dynamodb = boto3.client('dynamodb')
feed_table = os.environ['FEED_TABLE']
metadata_table = os.environ['METADATA_TABLE']

def handler(event, context):

    user_id = event['queryStringParameters']['userId']

    try:
        feed = get_feed(user_id)
        movies = get_metadata(feed)
                
        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(movies)
        }
    
    except Exception as e:
        logging.error(e)
        return {
            'headers': headers,
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def get_feed(user_id):
    response = dynamodb.query(
        TableName=feed_table,
        KeyConditionExpression='userId = :userId',
        ExpressionAttributeValues={':userId': {'S': user_id}}, 
        ProjectionExpression='points, category, relevance'
    )
        
    return response.get('Items', [])


def get_metadata(feed):
    response = dynamodb.scan(
        TableName=metadata_table,
        FilterExpression='attribute_exists(title)', 
        # TODO: Comment ProjectionExpression out if the cache isnt implemented 
        ProjectionExpression='directory, resolution, actors, directors, genres, createdAt'
    )
    items = response.get('Items', [])
    for item in items: 
        # TODO: Comment del out if the cache isnt implemented 
        item['rating'] = calculate_rating(parse_categories(item), feed)
        del item['actors']
        del item['directors']
        del item['genres']

    return sorted(items, key=lambda x: x.get('rating', 0), reverse=True)

def parse_categories(movie):
    categories = set()

    # TODO: Concatenate strings before splitting
    if movie['actors']['S']: categories.update(movie['actors']['S'].split(','))
    if movie['directors']['S']: categories.update(movie['directors']['S'].split(','))
    if movie['genres']['S']: categories.update(movie['genres']['S'].split(','))
    
    return categories

def calculate_rating(categories, feed):
    now = datetime.now()
    rating = 0
    for item in feed: 
        if item['category']['S'] in categories: 
            # TODO: Add scaling based on item['relevance']['S']
            # relevance = (now - datetime.fromisoformat(item['relevance']['S'])).total_seconds()
            # rating += item['points']['N'] * 1/relevance
            rating += int(item['points']['N'])
    return rating 


headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  
    'Access-Control-Allow-Methods': 'GET, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
},