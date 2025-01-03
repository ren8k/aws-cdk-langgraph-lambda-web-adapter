#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ReactAppStack } from '../lib/cdk-cloudfront-s3-stack';

const app = new cdk.App();
new ReactAppStack(app, 'ReactAppStack');
