import json
import boto3 # type: ignore
import os

sfn = boto3.client('stepfunctions')

def handler(event, context):
    state_machine_arn = os.environ['STATE_MACHINE_ARN']

    try: 
        for record in event['Records']:
            message_body = json.loads(record['body'])

            object = message_body['Object']
            resolutions = message_body['Resolutions']
            jobInputs = [{"input": {"Object": object, "Resolution": res}} for res in resolutions]

            response = sfn.start_execution(
                stateMachineArn=state_machine_arn,
                input=json.dumps({
                    "inputs": jobInputs
                })
            )
            
        print(f"Started transcoder execution: {response['executionArn']}")

    except Exception as e: 
        print('Error', e)
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error triggering transcoder: {str(e)}')
        }
        
    return {
        'statusCode': 200,
        'body': json.dumps('Transcoder triggered')
    }
