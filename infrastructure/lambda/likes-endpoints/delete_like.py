import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
table_name = os.environ['LIKES_TABLE']

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    
    userId = event['queryStringParameters']['userId']
    directory = event['queryStringParameters']['directory']

    try:
        response = dynamodb.delete_item(
            TableName=table_name,
            Key={
                'userId': {'S': userId},
                'directory': {'S': directory}
            }
        )

        logging.info(response)
        
        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(response)
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
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
},