import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as path from 'path';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';


interface NOtificationConstructProps {
    bucket: s3.IBucket;
    queue: sqs.IQueue;
}

export class NOtificationConstruct extends Construct {
    constructor(scope: Construct, id: string, props: NOtificationConstructProps) {
        super(scope, id);

        const ffmpeg = new lambda.LayerVersion(this, 'FFMPEG-Layer', {
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            code: lambda.Code.fromAsset(path.join(__dirname, '../../layer-assets', 'ffmpeg.zip')),
            compatibleArchitectures: [lambda.Architecture.ARM_64],
            description: 'FFMPEG static binary for ARM64 architecture.',
        });

        const transcode = new lambda.Function(this, 'TranscodeLambda', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'transcode.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
            timeout: cdk.Duration.seconds(300),
            architecture: lambda.Architecture.ARM_64,
            environment: {
                BUCKET_NAME: props.bucket.bucketName,
                QUEUE_URL: props.queue.queueUrl,
                PATH: 'bin'
            },
            layers: [ffmpeg]
        });

        props.bucket.grantRead(transcode);
        props.bucket.grantPut(transcode);

        const transcodeJob = new tasks.LambdaInvoke(this, 'TranscoderJob', {
            lambdaFunction: transcode,
            timeout: cdk.Duration.seconds(300),
            payload: sfn.TaskInput.fromObject({
                input: sfn.JsonPath.stringAt('$.input')
            }),
        })

        const mapState = new sfn.Map(this, 'MapState', {
            maxConcurrency: 5, // Adjust this as needed
            itemsPath: sfn.JsonPath.stringAt('$.inputs'),
        }).itemProcessor(transcodeJob);

        const definition = mapState;

        const stateMachine = new sfn.StateMachine(this, 'TranscoderStateMachine', {
            definition: definition,
            timeout: cdk.Duration.minutes(5),
        })

        transcode.grantInvoke(stateMachine);

        const trigger = new lambda.Function(this, 'TranscoderTriggerLambda', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'transcoder_trigger.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
            environment: {
                QUEUE_URL: props.queue.queueUrl,
                STATE_MACHINE_ARN: stateMachine.stateMachineArn,
            }
        });

        trigger.addEventSource(new SqsEventSource(props.queue, {
            batchSize: 10,
            maxBatchingWindow: cdk.Duration.minutes(5),
            reportBatchItemFailures: true
        }));

        stateMachine.grantStartExecution(trigger);
        props.queue.grantConsumeMessages(trigger);
    }
}
