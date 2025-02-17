import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import {FastapiLambdaWebAdapterCdkStack} from '../lib/fastapi-lambda-web-adapter-cdk-stack';

test('Snapshot test', () => {
  const app = new cdk.App();
  const stack = new FastapiLambdaWebAdapterCdkStack(app, 'TestStack');
  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
