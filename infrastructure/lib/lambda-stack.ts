import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as iam from 'aws-cdk-lib/aws-iam'
import path = require('path');

interface LambdaStackProps extends cdk.StackProps {
    bucket: s3.Bucket;
    // metada: dynamodb.Table;
}

export class LambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: LambdaStackProps) {
        super(scope, id, props);

        if (!props?.bucket) {
            throw new Error('Prop bucket is required');
        }

        const api = new apigateway.RestApi(this, 'StreamioApi', {
            restApiName: 'Video Streaming Service',
            description: 'Service for upload, download and streaming of videos.',
            binaryMediaTypes: ['*/*']
        });

        const uploadURL = new lambda.Function(this, 'UploadURLLambda', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'presigned_upload_url.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            // timeout: cdk.Duration.seconds(30)
            environment: {
                BUCKET_NAME: props.bucket.bucketName
            }
        });

        props.bucket.grantPut(uploadURL);

        const uploadURLResource = api.root.addResource('upload-url');
        const uploadURLIntegration = new apigateway.LambdaIntegration(uploadURL);
        uploadURLResource.addMethod('GET', uploadURLIntegration);


    }
}