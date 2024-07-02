import os
import boto3 # type: ignore
import json
import urllib.parse
import re
import logging
from decimal import Decimal

s3 = boto3.client('s3')
sqs = boto3.client('sqs')
bucket_name = os.environ['BUCKET_NAME']
queue_url = os.environ['QUEUE_URL']

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['METADATA_TABLE']

def handler(event, context):
    
    try: 
        for record in event['Records']: 
            key = urllib.parse.unquote_plus(record['s3']['object']['key'], encoding='utf-8')

            match = re.search(r'(\d+)p', key)

            if not match: 
                return {
                        'statusCode': 500,
                        'body': json.dumps(f'Object {key} does not match given regex.')
                    }

            if is_processed(key):
                return {
                    'statusCode': 200,
                    'body': json.dumps(f'Object {key} has already been processed.')
                }
    
            complete_metadata(key)

            return sqs.send_message(
                QueueUrl=queue_url,
                MessageBody=json.dumps({
                    'Object': key,
                    'Resolutions': get_expected_resolutions(int(match.group(1)))
                })
            )
        
    except Exception as e:
        logging.error(e)
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error processing object: {str(e)}')
        }
    

def complete_metadata(key):
    response = s3.head_object(Bucket=bucket_name, Key=key)
    
    dir, res = split_key(key)
    timestamp = response['LastModified'].isoformat()
    size = round(response['ContentLength']/(1024**2), 2) # Conversion to MB

    table = dynamodb.Table(table_name)
    table.update_item(
        Key={
            'directory': dir,
            'resolution': res
        }, 
        UpdateExpression="SET size = :size, createdAt = :createdAt, lastModified = :lastModified, uploaded = :uploaded",
        ExpressionAttributeValues={
            ':size': Decimal(str(size)), 
            ':createdAt': timestamp, 
            ':lastModified': timestamp,
            ':uploaded': True
        }
    )


def split_key(key):
    directory, filename = os.path.split(key)
    resolution, _ = os.path.splitext(filename)

    return [directory, resolution]


def is_processed(key): 
    tags = s3.get_object_tagging(Bucket=bucket_name, Key=key)

    for tag in tags['TagSet']: 
        if tag['Key'] == 'Processed' and tag['Value'] == 'True': 
            return True

    return False


def get_expected_resolutions(resolution):
    resolutions = [144, 240, 360, 480, 720, 1080, 1440, 2160]
    return [f"{res}p" for res in resolutions if res < resolution]