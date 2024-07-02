import os
import boto3 # type: ignore
import json
import urllib.parse
import re

s3 = boto3.client('s3')
sqs = boto3.client('sqs')
bucket_name = os.environ['BUCKET_NAME']
queue_url = os.environ['QUEUE_URL']

def handler(event, context):
    
    for record in event['Records']: 
        key = urllib.parse.unquote_plus(record['s3']['object']['key'], encoding='utf-8')

        match = re.search(r'(\d+)p', key)

        if not match: 
            return {
                    'statusCode': 500,
                    'body': json.dumps(f'Object {key} does not match given regex.')
                }


        tags = s3.get_object_tagging(Bucket=bucket_name, Key=key)

        for tag in tags['TagSet']: 
            if tag['Key'] == 'Processed' and tag['Value'] == 'true': 

                return {
                    'statusCode': 200,
                    'body': json.dumps(f'Object {key} has already been processed.')
                }
   
        transcoder_resolutions = [f"{res}p" for res in resolutions if res < int(match.group(1))]

        return sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps({
                'Object': key,
                'Resolutions': transcoder_resolutions
            })
        )

resolutions = [144, 240, 360, 480, 720, 1080, 1440, 2160]