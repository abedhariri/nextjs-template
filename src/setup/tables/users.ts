import { CreateTableCommandInput } from '@aws-sdk/client-dynamodb';

export const table: CreateTableCommandInput = {
  TableName: 'users',
  AttributeDefinitions: [
    {
      AttributeName: 'UserId',
      AttributeType: 'S', // 'S' for string
    },
    {
      AttributeName: 'Email',
      AttributeType: 'S', // 'S' for string
    },
  ],
  KeySchema: [
    {
      AttributeName: 'UserId',
      KeyType: 'HASH', // Partition key
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'EmailIndex',
      KeySchema: [
        {
          AttributeName: 'Email',
          KeyType: 'HASH', // Partition key for the index
        },
      ],
      Projection: {
        ProjectionType: 'ALL', // Projects all attributes
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};
