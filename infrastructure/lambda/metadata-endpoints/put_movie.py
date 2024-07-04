import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
table_name = os.environ['METADATA_TABLE']

def handler(event, context):
    # Extract path parameter
    directory = event['pathParameters']['movie_name']
    
    try:
        # Query DynamoDB for items with the given partition key
        response = dynamodb.query(
            TableName=table_name,
            KeyConditionExpression='directory = :dir',
            ExpressionAttributeValues={':dir': {'S': directory}}
        )
        
        items = response.get('Items', [])
        
        if not items:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Movie not found'})
            }
        
        largest_item = max(items, key=lambda x: x['resolution']['S'])
        
        return {
            'statusCode': 200,
            'body': json.dumps(largest_item)
        }
    
    except Exception as e:
        logging.error(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
