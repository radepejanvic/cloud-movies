#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const app = new cdk.App();

new InfrastructureStack(app, 'Frankfurt', {
	env: { region: "eu-central-1" },
	encryptBucket: false
});

new InfrastructureStack(app, 'Stockholm', {
	env: { region: "eu-north-1" },
	encryptBucket: true
});

app.synth();