import base64
import json
import boto3
import os

s3 = boto3.client('s3')

def handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    
    bucket_name = os.environ['BUCKET_NAME']
    
    try:
        file_name = event['queryStringParameters']['file_name']
        
        s3_response = s3.get_object(Bucket=bucket_name, Key=file_name)
        
        file_content = s3_response['Body'].read()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'video/mp4',
                'Content-Disposition': f'attachment; filename="{file_name}"'
            },
            'body': base64.b64encode(file_content).decode('utf-8'),
            'isBase64Encoded': True
        }
    except Exception as e:
        print('Error', e)
        return {
            'statusCode': 500,
            'body': json.dumps(f'Failed to download video from S3 bucket. {str(e)}')
        }

