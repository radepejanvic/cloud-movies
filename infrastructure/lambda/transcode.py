import os
import boto3 # type: ignore
import subprocess
import logging
import uuid

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']

def handler(event, context):

    ffmpeg_path = '/opt/bin/ffmpeg'
    input = event['input']

    logging.info(f'Transcode job input: {input}')

    input_key = input['Object']
    res = input['Resolution']

    output_key = f"{os.path.split(input_key)[0]}/{res}.mp4"

    temp_key = uuid.uuid4()
    logging.info(f'UUID: {temp_key}')

    input_file_path = f"/tmp/{temp_key}"
    output_file_path = f"/tmp/out{temp_key}.mp4"

    try:
        s3.download_file(bucket_name, input_key, input_file_path)

        command = [
            ffmpeg_path,
            '-i', input_file_path,
            '-vf', scales[res],
            '-crf', '23', 
            '-preset', 'ultrafast',
            '-c:a', 'copy', 
            output_file_path
        ]

        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            # Handle ffmpeg execution failure
            error_message = f"ffmpeg error: {result.stderr}"
            print(error_message)
            return {
                'statusCode': 500,
                'body': error_message
            }
        
        # s3.upload_file(output_file_path, bucket_name, output_key)
        with open(output_file_path, 'rb') as file_data:
            s3.put_object(Bucket=bucket_name, Key=output_key, Body=file_data)

        response = s3.put_object_tagging(
            Bucket=bucket_name,
            Key=output_key,
            Tagging={
                'TagSet': [
                    {
                        'Key': 'Replica',
                        'Value': 'True'
                    },
                ]
            }
        )
        logging.info(f'{output_key}: {response}')

        # Handle successful execution
        output_message = f"ffmpeg output: {result.stdout}"
        print(output_message)
        return {
            'statusCode': 200,
            'body': output_message
        }
    except Exception as e:
        # Handle any other exceptions
        error_message = f"Exception: {str(e)}"
        print(error_message)
        return {
            'statusCode': 500,
            'body': error_message
        }


scales = {
    "144p": "scale=256:144",
    "240p": "scale=426:240",
    "360p": "scale=640:360",
    "480p": "scale=854:480",
    "720p": "scale=1280:720",
    "1080p": "scale=1920:1080",
    "1440p": "scale=2560:1440",
    "2160p": "scale=3840:2160"
}