#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StorageStack } from '../lib/storage-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { SecurityStack } from '../lib/security-stack';
import { AngularStack } from '../lib/stacks/angular-stack';

const app = new cdk.App();

const bucket = new StorageStack(app, 'StorageStack')

new LambdaStack(app, 'LambdaStack', {
	bucket: bucket.bucket
})

new SecurityStack(app, 'SecurityStack');

new AngularStack(app, 'AngularStack');

app.synth();