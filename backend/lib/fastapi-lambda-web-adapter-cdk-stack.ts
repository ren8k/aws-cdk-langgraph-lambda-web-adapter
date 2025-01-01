import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class FastapiLambdaWebAdapterCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数の作成
    const fastApiFunction = new lambda.DockerImageFunction(this, 'FastAPIFunction', {
      code: lambda.DockerImageCode.fromImageAsset('./app', {
        file: 'Dockerfile',
      }),
      memorySize: 512,
      timeout: cdk.Duration.seconds(300),
      // environment: {
      //   AWS_LWA_INVOKE_MODE: 'RESPONSE_STREAM',
      // },
      tracing: lambda.Tracing.ACTIVE,
    });

    // Bedrock用のIAMポリシーを追加
    fastApiFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['bedrock:InvokeModel'],
      resources: ['*'],
      sid: 'BedrockInvokePolicy',
    }));

    // Function URLの設定
    const functionUrl = fastApiFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
    });

    // 出力の設定
    new cdk.CfnOutput(this, 'FastAPIFunctionUrl', {
      description: 'Function URL for FastAPI function',
      value: functionUrl.url,
    });

    new cdk.CfnOutput(this, 'FastAPIFunctionArn', {
      description: 'FastAPI Lambda Function ARN',
      value: fastApiFunction.functionArn,
    });
  }
}
