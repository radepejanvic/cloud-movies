import boto3 # type: ignore
import logging
import json
import os

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']
dynamodb = boto3.client('dynamodb')
table_name = os.environ['METADATA_TABLE']

def handler(event, context):
    directory = event['queryStringParameters']['directory']
    
    try: 
        s3_response = delete_from_s3(directory)
        dynamo_response = delete_from_dynamo(directory)

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f'{directory} deleted successfully',
                'S3': s3_response,
                'DynamoDB': dynamo_response
                }),
            'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS', 
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
            }
        }
        
    except Exception as e: 
        logging.error(f'Error: {str(e)}')
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS', 
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
            }
        }

    
def delete_from_s3(directory):
    prefix = f'{directory}/'
    objects = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

    # Extract object keys
    keys = [obj['Key'] for obj in objects.get('Contents', [])]

    response = {}

    # Delete each object
    for key in keys:
        response = s3.delete_object(Bucket=bucket_name, Key=key)

    s3.delete_object(Bucket=bucket_name, Key=prefix)

    return response


def delete_from_dynamo(directory): 
    # Query DynamoDB for items with the partition key
    response = dynamodb.query(
        TableName=table_name,
        KeyConditionExpression='directory = :dir',
        ExpressionAttributeValues={':dir': {'S': directory}}
    )

    items = response['Items']

    # Delete table each item
    for item in items:
        resolution = item['resolution']['S']
        response = dynamodb.delete_item(
            TableName=table_name,
            Key={
                'directory': {'S': directory},
                'resolution': {'S': resolution}
            }
        )
    
    return response