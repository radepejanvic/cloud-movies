import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface InfrastructureStackProps extends cdk.StackProps {
  encryptBucket?: boolean;
}

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: InfrastructureStackProps) {
    super(scope, id, props);

    // Add a Boolean property "encryptBucket" to the stack constructor.
    // If true, creates an encrypted bucket. Otherwise, the bucket is unencrypted.
    // Encrypted bucket uses KMS-managed keys (SSE-KMS).
    // if (props && props.encryptBucket) {
    //   new s3.Bucket(this, "MyGroovyBucket", {
    //     encryption: s3.BucketEncryption.KMS_MANAGED,
    //     removalPolicy: cdk.RemovalPolicy.DESTROY
    //   });
    // } else {
    //   new s3.Bucket(this, "MyGroovyBucket", {
    //     removalPolicy: cdk.RemovalPolicy.DESTROY
    //   });
    // }

    const bucket = new s3.Bucket(this, 'MovieBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: "streamio-movie-bucket",
      versioned: true,
    });

    const postMovieLambda = new lambda.Function(this, 'uploadMovie', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'postMovie.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30)
    });

    const getMovieLambda = new lambda.Function(this, 'getMovie', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'getMovie.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30)
    });

    postMovieLambda.addEnvironment('BUCKET_NAME', bucket.bucketName);
    getMovieLambda.addEnvironment('BUCKET_NAME', bucket.bucketName);

    bucket.grantPut(postMovieLambda);
    bucket.grantRead(getMovieLambda);

    const api = new apigateway.RestApi(this, 'MyVideoUploadApi', {
      restApiName: 'Video Upload Service',
      description: 'This service uploads videos to S3.',
      binaryMediaTypes: ['*/*']
    });

    const uploadResource = api.root.addResource('upload');
    const uploadIntegration = new apigateway.LambdaIntegration(postMovieLambda);
    uploadResource.addMethod('POST', uploadIntegration);

    const downloadResource = api.root.addResource('download');
    const downloadIntegration = new apigateway.LambdaIntegration(getMovieLambda);
    downloadResource.addMethod('GET', downloadIntegration);
  }
}
