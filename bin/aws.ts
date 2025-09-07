#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaAPIStack } from '../lib/lambda-api-stack';

const app = new cdk.App();

new LambdaAPIStack(app, 'LambdaApigatewayStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});
