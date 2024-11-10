import { CreateTableCommandInput, KeyType, ScalarAttributeType } from '@aws-sdk/client-dynamodb';

export const table: CreateTableCommandInput = {
  TableName: 'next-auth',
  KeySchema: [
    { AttributeName: 'pk', KeyType: KeyType.HASH }, // Partition Key
    { AttributeName: 'sk', KeyType: KeyType.RANGE }, // Sort Key
  ],
  AttributeDefinitions: [
    { AttributeName: 'pk', AttributeType: ScalarAttributeType.S }, // Partition key
    { AttributeName: 'sk', AttributeType: ScalarAttributeType.S }, // Sort key
    { AttributeName: 'GSI1PK', AttributeType: ScalarAttributeType.S }, // GSI Partition key
    { AttributeName: 'GSI1SK', AttributeType: ScalarAttributeType.S }, // GSI Sort key
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'GSI1', // Corrected GSI name to GSI1
      KeySchema: [
        { AttributeName: 'GSI1PK', KeyType: KeyType.HASH }, // GSI Partition Key
        { AttributeName: 'GSI1SK', KeyType: KeyType.RANGE }, // GSI Sort Key
      ],
      Projection: {
        ProjectionType: 'ALL', // Include all attributes in the index
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5, // Specify the read capacity units for the table
    WriteCapacityUnits: 5, // Specify the write capacity units for the table
  },
};
