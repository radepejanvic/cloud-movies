import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
table_name = os.environ['LIKES_TABLE']

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    
    body = json.loads(event['body'])

    try:
        response = dynamodb.put_item(
            TableName=table_name,
            Item={
                'userId': {'S': body['userId']},  
                'directory': {'S': body['directory']},
                'liked': {'BOOL': body['liked']},
            }
        )
        
        logging.info(response)

        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(body)
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
},