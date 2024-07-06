import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
table_name = os.environ['SUBSCRIPTIONS_TABLE']

def handler(event, context):

    userId = event['queryStringParameters']['userId']

    try:
        response = dynamodb.get_item(
            TableName=table_name,
            Key={'userId': {'S': userId}}
        )
        
        item = response.get('Item', {})
        
        if not item:
            return {
                'headers': headers,
                'statusCode': 404,
                'body': json.dumps({'message': f'User {userId} not found'})
            }
                
        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(item)
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