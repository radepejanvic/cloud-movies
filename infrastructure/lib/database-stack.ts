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
                    indexName: 'title-index',
                    partitionKey: {
                        name: 'title',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'directory',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                },
                {
                    indexName: 'description-index',
                    partitionKey: {
                        name: 'description',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'directory',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                },
                {
                    indexName: 'actors-index',
                    partitionKey: {
                        name: 'actors',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'directory',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                },
                {
                    indexName: 'directors-index',
                    partitionKey: {
                        name: 'directors',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'directory',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                },
                {
                    indexName: 'genres-index',
                    partitionKey: {
                        name: 'genres',
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
                    indexName: 'movie-index',
                    partitionKey: {
                        name: 'movie',
                        type: dynamodb.AttributeType.STRING
                    },
                    sortKey: {
                        name: 'userId',
                        type: dynamodb.AttributeType.STRING
                    },
                    projectionType: dynamodb.ProjectionType.ALL
                }
            ],
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

    }
}
