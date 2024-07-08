import boto3 # type: ignore
import json
import os
import logging

dynamodb = boto3.client('dynamodb')
table_name = os.environ['METADATA_TABLE']

def handler(event, context):

    query_params = event.get('queryStringParameters', '')
    items = {}

    try: 
        if not query_params: 
            items = get_all()

        else: 
            value = query_params.get('query', '')

            if value: 
                for index_name, key_name in gsi_dict.items():
                    items = query(value, index_name, key_name)
                    if items: break 
        
        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(items)
        }

    except Exception as e:
        logging.error(f"Error: {e}")
        return {
            'headers': headers,
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }


def query(value, index_name, key_name):
    response = dynamodb.query(
        TableName=table_name,
        IndexName=index_name,
        KeyConditionExpression=f'{key_name} = :key',
        ExpressionAttributeValues={':key': {'S': value}}
    )
    
    items = response.get('Items', [])
    
    logging.info(items)

    return items


def get_all():
    response = dynamodb.scan(
        TableName=table_name,
        IndexName='title-index'
    )

    items = response.get('Items', [])

    logging.info(items)

    return items
     

gsi_dict = {
    "title-index": "title",
    "description-index": "description",
    "actors-index": "actors",
    "directors-index": "directors",
    "genres-index": "genres"
}

headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  
    'Access-Control-Allow-Methods': 'GET, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
}