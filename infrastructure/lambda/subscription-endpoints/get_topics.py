import boto3 # type: ignore
import json
import os
import logging 

sns = boto3.client('sns')

def handler(event, context):
    try:
        response = sns.list_topics()
                
        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(response['Topics'])
        }
    
    except Exception as e:
        logging.error(e)
        return {
            'headers': headers,
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  
    'Access-Control-Allow-Methods': 'GET, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'
},