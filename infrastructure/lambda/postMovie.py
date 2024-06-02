import json
import boto3
import os
import base64

s3 = boto3.client('s3')

def handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    
    bucket_name = os.environ['BUCKET_NAME']
    
    try:
        file_content = base64.b64decode(event['body']['video_data'])
        file_name = event['body']['file_name']
        
        s3.put_object(Bucket=bucket_name, Key=file_name, Body=file_content)
        
        print('Success')
        return {
            'statusCode': 200,
            'body': json.dumps('Video uploaded to S3 bucket successfully!')
        }
    except Exception as e:
        print('Error', e)
        return {
            'statusCode': 500,
            'body': json.dumps(f'Failed to upload video to S3 bucket. {str(e)}')
        }