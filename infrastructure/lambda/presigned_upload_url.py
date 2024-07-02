import json
import boto3 # type: ignore
import os
import logging

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['METADATA_TABLE'])

def handler(event, context):
    # Extract parameters from the request
    movie_name = event['queryStringParameters']['movie_name']
    uuid = event['queryStringParameters']['uuid']
    resolution = event['queryStringParameters']['resolution']
    
    # Extract the bucket name from the environment variable
    bucket_name = os.environ['BUCKET_NAME']

    # Construct the S3 object key
    object_key = f"{movie_name}-{uuid}/{resolution}.mp4"

    try:
        presigned_url = s3_client.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': bucket_name,
                'Key': object_key,
                'ContentType': 'video/mp4',
                },
            ExpiresIn=3600,  # URL expires in 1 hour
        )

        prepare_metadata(event)

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


def prepare_metadata(event):
    movie_name = event['queryStringParameters']['movie_name']
    uuid = event['queryStringParameters']['uuid']

    metadata = {
        'directory': f'{movie_name}-{uuid}',
        'resolution': event['queryStringParameters']['resolution'],
        'type': 'mp4',
        'title': movie_name,
        'description': event['queryStringParameters']['description'],
        'actors': event['queryStringParameters']['actors'],
        'directors': event['queryStringParameters']['directors'],
        'genres': event['queryStringParameters']['genres'],
        'uploaded': False
    }

    table.put_item(Item=metadata)
    
 