import { dbClient } from '@/lib/dynamodb';
import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { User } from './type';
import { v4 as uuid } from 'uuid';

export const getUserByEmail = async (email: string, withPassword = false): Promise<User | null> => {
  const queryParams = {
    TableName: 'users',
    IndexName: 'EmailIndex', // Use the email GSI for querying by email
    KeyConditionExpression: 'Email = :email',
    ExpressionAttributeValues: {
      ':email': { S: email },
    },
  };

  try {
    const users = await dbClient.send(new QueryCommand(queryParams));
    if (!users.Items || users.Items?.length === 0) return null;

    return {
      id: users.Items[0].UserId.S!,
      email: users.Items[0].Email.S!,
      password: withPassword ? users.Items[0].Password.S! : undefined,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createUser = async (email: string, password: string) => {
  const userId = uuid();
  const putParams = {
    TableName: 'users',
    Item: {
      UserId: { S: userId },
      Email: { S: email },
      Password: { S: password }, // Note: Storing passwords in plain text is NOT recommended. Use a hashing mechanism.
    },
  };
  await dbClient.send(new PutItemCommand(putParams));
};
