import boto3 # type: ignore
import json
import os
import logging 

dynamodb = boto3.client('dynamodb')
table_name = os.environ['METADATA_TABLE']

def handler(event, context):
    
    body = json.loads(event['body'])

    try:

        response = dynamodb.update_item(
            TableName=table_name,
            Key={
                'directory': {'S': body['directory']},
                'resolution': {'S': body['resolution']}
            }, 
            UpdateExpression="SET title = :title, description = :desc, actors = :actors, directors = :directors, genres = :genres, thumbnail = :thumbnail",
            ExpressionAttributeValues={
                ':title': {'S': body['title']},
                ':desc': {'S': body['description']},
                ':actors': {'S': body['actors']},
                ':directors': {'S': body['directors']},
                ':genres': {'S': body['genres']},
                ':thumbnail': {'S': body['thumbnail']},
            }
        )
        
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
},