import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as iam from 'aws-cdk-lib/aws-iam'
import path = require('path');
import { CognitoPool } from './cognito';

interface LambdaStackProps extends cdk.StackProps {
    bucket: s3.Bucket;
    metadata: dynamodb.TableV2;
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
            environment: {
                BUCKET_NAME: props.bucket.bucketName,
                METADATA_TABLE: props.metadata.tableName
            }
        });

        props.bucket.grantReadWrite(uploadURL);
        props.metadata.grantWriteData(uploadURL);

        const uploadURLResource = api.root.addResource('upload-url');
        const uploadURLIntegration = new apigateway.LambdaIntegration(uploadURL);
        uploadURLResource.addMethod('GET', uploadURLIntegration);

        const downloadURL = new lambda.Function(this, 'DownloadURLLambda', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'presigned_download_url.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                BUCKET_NAME: props.bucket.bucketName
            }
        });

        props.bucket.grantRead(downloadURL);

        const downloadURLResource = api.root.addResource('download-url');
        const downloadURLIntegration = new apigateway.LambdaIntegration(downloadURL);
        downloadURLResource.addMethod('GET', downloadURLIntegration);

        const previewURL = new lambda.Function(this, 'PreviewURLLambda', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'presigned_preview_url.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                BUCKET_NAME: props.bucket.bucketName
            }
        });

        props.bucket.grantRead(previewURL);

        const previewURLResource = api.root.addResource('preview-url');
        const previewURLIntegration = new apigateway.LambdaIntegration(previewURL);
        previewURLResource.addMethod('GET', previewURLIntegration);
    }
}