import json
import boto3 # type: ignore
import os
import logging
from datetime import datetime, timezone

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table_name = os.environ['HISTORY_TABLE']

def handler(event, context):
    # Extract parameters from the request
    movie_name = event['queryStringParameters']['movie_name']
    uuid = event['queryStringParameters']['uuid']
    resolution = event['queryStringParameters']['resolution']
    user = event['queryStringParameters']['user']
    
    # Extract the bucket name from the environment variable
    bucket_name = os.environ['BUCKET_NAME']

    # Construct the S3 object key
    object_key = f"{movie_name}-{uuid}/{resolution}.mp4"
    
    try:
        presigned_url = s3_client.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': bucket_name,
                'Key': object_key,
                'ResponseContentDisposition': f'attachment; filename="{movie_name}.mp4"'
                },
            ExpiresIn=3600,  # URL expires in 1 hour            
        )

        add_to_watch_history(f"{movie_name}-{uuid}", user)

    except Exception as e:
        logging.error(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps({'upload_url': presigned_url})
    }


def add_to_watch_history(movie_key, user): 
    
    timestamp = datetime.now(timezone.utc).isoformat()

    table = dynamodb.Table(table_name)
    table.put_item(
        Item={
        'userId': user,
        'timestamp': timestamp,
        'movie': movie_key
    })