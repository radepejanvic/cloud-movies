import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
table_name = os.environ['SUBSCRIPTIONS_TABLE']

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    
    body = json.loads(event['body'])

    try:
        response = dynamodb.update_item(
            TableName=table_name,
            Key={
                'userId': {'S': body['userId']}
            },
            UpdateExpression='SET email = :email, topics = :topics',
            ExpressionAttributeValues={
                ':email': {'S': body['email']},
                ':topics': {'SS': body['topics'] if not body['topics'] == [] else [' ']},
            },
            ReturnValues='ALL_NEW'
        )
        
        logging.info(response)

        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps({
                'sub': body, 
                'DynamoDB': response
            })
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
    'Access-Control-Allow-Methods': 'PUT, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
},