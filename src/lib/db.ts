import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient({
  credentials: {
    accessKeyId: "id",
    secretAccessKey: "secret",
  },
});

export const docClient = DynamoDBDocumentClient.from(dbClient);
