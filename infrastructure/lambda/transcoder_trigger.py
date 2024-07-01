import json
import boto3 # type: ignore
import os

stepfunctions = boto3.client('stepfunctions')

def handler(event, context):
    state_machine_arn = os.environ['STATE_MACHINE_ARN']

    print(event)
    
    for record in event['Records']:
        message_body = record['body']
        
        response = stepfunctions.start_execution(
            stateMachineArn=state_machine_arn,
            input=message_body
        )
        
        print(f"Started Transcoder execution: {response['executionArn']}")
        
    return {
        'statusCode': 200,
        'body': json.dumps('Transcoder Triggered')
    }
