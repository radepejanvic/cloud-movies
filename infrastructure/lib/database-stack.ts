import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export class DatabaseStack extends cdk.Stack {

    public readonly metadata: dynamodb.TableV2;
    public readonly history: dynamodb.TableV2;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.metadata = new dynamodb.TableV2(this, 'MoviesMetadataTable', {
            tableName: "Metadata",
            partitionKey: { name: 'directory', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'resolution', type: dynamodb.AttributeType.STRING },
            globalSecondaryIndexes: [
                {
                    indexName: 'title',
                    partitionKey: {
                        name: 'resolution',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'directory',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                },
                {
                    indexName: 'description',
                    partitionKey: {
                        name: 'resolution',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'directory',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                },
                {
                    indexName: 'actors',
                    partitionKey: {
                        name: 'resolution',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'directory',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                },
                {
                    indexName: 'directors',
                    partitionKey: {
                        name: 'resolution',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'directory',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                },
                {
                    indexName: 'genres',
                    partitionKey: {
                        name: 'resolution',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'directory',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                }

            ],
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        this.history = new dynamodb.TableV2(this, 'WatchHistoryTable', {
            tableName: "WatchHistory",
            partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            globalSecondaryIndexes: [
                {
                    indexName: 'movie',
                    partitionKey: {
                        name: 'userId',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'timestamp',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                }
            ],
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

    }
}
