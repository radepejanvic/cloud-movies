import json
import boto3 # type: ignore
import os

s3_client = boto3.client('s3')

def handler(event, context):
    # Extract parameters from the request
    movie_name = event['queryStringParameters']['movie_name']
    uuid = event['queryStringParameters']['uuid']
    
    # Extract the resolution parameter if it exists, otherwise default to an empty string
    # resolution = event['queryStringParameters'].get('resolution', '')
    
    # Extract the bucket name from the environment variable
    bucket_name = os.environ['BUCKET_NAME']

    # Construct the S3 object key
    # object_key = f"{bucket_name}/{movie_name}-{uuid}/{resolution}"
    object_key = f"{movie_name}-{uuid}/480p"
    
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
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps({'upload_url': presigned_url})
    }
