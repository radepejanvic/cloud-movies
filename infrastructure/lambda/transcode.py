import os
import boto3 # type: ignore
import subprocess

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']

def handler(event, context):

    ffmpeg_path = '/opt/bin/ffmpeg'

    input = event['input']

    input_key = input['Object']
    res = input['Resolution']
    output_key = f"{os.path.split(input_key)[0]}/{res}.mp4"

    input_file_path = f"/tmp/{os.path.basename(input_key)}"
    output_file_path = f"/tmp/output.mp4"

    try:
        s3.download_file(bucket_name, input_key, input_file_path)

        command = [
            ffmpeg_path,
            '-i', input_file_path,
            '-vf', scales[res],
            '-c:v', 'libx264', 
            '-crf', '23', 
            '-preset', 'veryfast',
            '-c:a', 'aac', 
            '-b:a', '128k', 
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
        
        s3.upload_file(output_file_path, bucket_name, output_key)
        
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