#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { StorageStack } from '../lib/storage-stack';
import { LambdaStack } from '../lib/lambda-stack';

const app = new cdk.App();

new InfrastructureStack(app, 'Frankfurt', {
	env: { region: "eu-central-1" },
	encryptBucket: false
});

new InfrastructureStack(app, 'Stockholm', {
	env: { region: "eu-north-1" },
	encryptBucket: true
});

const bucket = new StorageStack(app, 'StorageStack')
new LambdaStack(app, 'LambdaStack', {
	bucket: bucket.bucket
})

app.synth();