import os
import boto3 # type: ignore
import json
import urllib.parse

s3 = boto3.client('s3')
sqs = boto3.client('sqs')
bucket_name = os.environ['BUCKET_NAME']
queue_url = os.environ['QUEUE_URL']

def handler(event, context):
    
    for record in event['Records']: 
        key = urllib.parse.unquote_plus(record['s3']['object']['key'], encoding='utf-8')

        tags = s3.get_object_tagging(Bucket=bucket_name, Key=key)

        for tag in tags['TagSet']: 
            if tag['Key'] == 'Processed' and tag['Value'] == 'true': 

                print(f'Object {key} has already been processed. Skipping.')
            
                return {
                    'statusCode': 200,
                    'body': json.dumps(f'Object {key} has already been processed.')
                }
   
        print(f'Sending object {key} to SQS...')

        return sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps({
                'Object': key,
                'Resolutions': []
            })
        )
