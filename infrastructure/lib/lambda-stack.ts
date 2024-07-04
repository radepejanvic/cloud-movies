import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as lambdaAuthorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import path = require('path');
import { CognitoPool } from './cognito';
import { Cors } from 'aws-cdk-lib/aws-apigateway';

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

        const authorizerLayer = new lambda.LayerVersion(this, 'Authorizer-Layer', {
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            code: lambda.Code.fromAsset(path.join(__dirname, '../layer-assets', 'authorizer.zip')),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
            description: 'Authorizer aws-jwt-verify node module',
        });

        const authorizerFunction = new lambda.Function(this, 'AuthorizerFunction', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'authorizer.handler',
            timeout: cdk.Duration.seconds(10),
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            layers: [authorizerLayer]
        });

        const api = new apigatewayv2.HttpApi(this, 'StreamioApi', {
            apiName: 'Video Streaming Service',
            description: 'Service for upload, download and streaming of videos.',
            corsPreflight: {
                allowMethods: [
                    apigatewayv2.CorsHttpMethod.GET,
                    apigatewayv2.CorsHttpMethod.DELETE,
                    apigatewayv2.CorsHttpMethod.PUT,
                    apigatewayv2.CorsHttpMethod.POST,
                    apigatewayv2.CorsHttpMethod.OPTIONS,
                ],
                allowOrigins: ["http://localhost:4200"],
                allowHeaders: ["Content-Type", "Authorization"],
                allowCredentials: true,
                exposeHeaders: ["*"],
            },
             
        });

        const httpAuthorizer = new lambdaAuthorizers.HttpLambdaAuthorizer(
            "HttpLambdaAuthorizer",
            authorizerFunction,
            {
                responseTypes: [
                    lambdaAuthorizers.HttpLambdaResponseType.SIMPLE,
                ],
            }
        );

        const uploadURL = new lambda.Function(this, 'UploadURLLambda', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'presigned_upload_url.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                BUCKET_NAME: props.bucket.bucketName
            }
        });

        props.bucket.grantPut(uploadURL);


        const uploadURLIntegration = new HttpLambdaIntegration(
            "GetUploadUrl",
            uploadURL
        );
        api.addRoutes({
            path: "/upload-url",
            methods: [apigatewayv2.HttpMethod.GET],
            integration: uploadURLIntegration,
            authorizer: httpAuthorizer,
        });


        const downloadURL = new lambda.Function(this, 'DownloadURLLambda', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'presigned_download_url.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                BUCKET_NAME: props.bucket.bucketName
            }
        });

        props.bucket.grantRead(downloadURL);
        
        const downloadURLIntegration = new HttpLambdaIntegration(
            "DownloadURL",
            downloadURL
        );
        api.addRoutes({
            path: "/download-url",
            methods: [apigatewayv2.HttpMethod.GET],
            integration: downloadURLIntegration,
            authorizer: httpAuthorizer,
        });

        const previewURL = new lambda.Function(this, 'PreviewURLLambda', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'presigned_preview_url.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                BUCKET_NAME: props.bucket.bucketName
            }
        });

        props.bucket.grantRead(previewURL);

        const previewURLIntegration = new HttpLambdaIntegration(
            "PreviewURL",
            downloadURL
        );
        api.addRoutes({
            path: "/preview-url",
            methods: [apigatewayv2.HttpMethod.GET],
            integration: previewURLIntegration,
            authorizer: httpAuthorizer,
        });

    }
}