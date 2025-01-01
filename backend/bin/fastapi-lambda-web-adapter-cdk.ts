import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FastapiLambdaWebAdapterCdkStack } from '../lib/fastapi-lambda-web-adapter-cdk-stack';

const app = new cdk.App();
new FastapiLambdaWebAdapterCdkStack(app, 'FastapiLambdaWebAdapterCdkStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});
