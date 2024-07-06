import json
import boto3 # type: ignore
import os
import logging

s3_client = boto3.client('s3')
dynamodb = boto3.client('dynamodb')
table_name = os.environ['METADATA_TABLE']

def handler(event, context):
    # Extract parameters from the request
    body = json.loads(event['body'])
    
    movie_name = body['movie_name']
    uuid = body['uuid']
    resolution = body['resolution']

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

        prepare_metadata(body)

    except Exception as e:
        logging.error(e)
        return {
            'headers': headers,
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    
    return {
        'headers': headers,
        'statusCode': 200,
        'body': json.dumps({'upload_url': presigned_url}),
    }


def prepare_metadata(body):
    movie_name = body['movie_name']
    uuid = body['uuid']

    directory = f'{movie_name}-{uuid}'
    logging.warning(body)
    logging.warning(directory)
    logging.warning(type(directory))
    dynamodb.put_item(
        TableName= table_name,
        Item={
        'directory': {'S': directory},
        'resolution': {'S': body['resolution']}, 
        'type': {'S': 'mp4'},
        'title': {'S': movie_name},
        'description': {'S': body['description']},
        'actors': {'S': body['actors']},
        'directors': {'S': body['directors']},
        'genres': {'S': body['genres']},
        'uploaded': {'BOOL': False},
        'thumbnail': {'S': body['thumbnail']}
    })
    
headers =  {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
    },