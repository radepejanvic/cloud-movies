import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
feed_table = os.environ['FEED_TABLE']
metadata_table = os.environ['METADATA_TABLE']

def handler(event, context):

    user_id = event['queryStringParameters']['userId']

    try:
        feed = get_feed(user_id)
        movies = get_metadata()
                
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


def get_metadata():
    response = dynamodb.scan(
        TableName=metadata_table,
        FilterExpression='attribute_exists(title)'
    )
    
    return response.get('Items', [])


headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  
    'Access-Control-Allow-Methods': 'GET, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
},