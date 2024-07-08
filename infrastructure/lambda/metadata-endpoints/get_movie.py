import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
table_name = os.environ['METADATA_TABLE']

def handler(event, context):

    directory = event['queryStringParameters']['movie_name']

    try:
        response = dynamodb.query(
            TableName=table_name,
            KeyConditionExpression='directory = :dir',
            ExpressionAttributeValues={':dir': {'S': directory}}
        )
        
        items = response.get('Items', [])
        
        if not items:
            return {
                'headers': headers,
                'statusCode': 404,
                'body': json.dumps({'message': 'Movie not found'})
            }
                
        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(items)
        }
    
    except Exception as e:
        logging.error(e)
        return {
            'headers': headers,
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  
    'Access-Control-Allow-Methods': 'GET, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
},