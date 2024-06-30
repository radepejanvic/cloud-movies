#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StorageStack } from '../lib/storage-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { SecurityStack } from '../lib/security-stack';
import { TranscoderStack } from '../lib/transcoder-stack';
import { AngularStack } from '../lib/stacks/angular-stack';

const app = new cdk.App();

const storage = new StorageStack(app, 'StorageStack')

new LambdaStack(app, 'LambdaStack', {
	bucket: storage.bucket
})

new SecurityStack(app, 'SecurityStack');

new TranscoderStack(app, 'TranscoderStack', {
	bucketName: storage.bucket.bucketName
});
new AngularStack(app, 'AngularStack');

app.synth();