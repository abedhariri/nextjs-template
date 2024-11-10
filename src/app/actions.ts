'use server';

import { signIn } from '@/lib/auth';
import { dbClient } from '@/lib/dynamodb';
import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { hashSync } from 'bcryptjs';
import { z } from 'zod';
import { signInSchema, signUpSchema } from '@/schema/auth';

export const signInWithEmailAndPassword = async (formData: z.infer<typeof signInSchema>) => {
  try {
    const response = await signIn('credentials', formData);
    console.log(response);
    if (!response)
      return {
        message: 'Email or password is incorrect',
      };

    return {
      message: '',
    };
  } catch (error) {
    if (isRedirectError(error)) redirect('/');
    else
      return {
        message: 'Email or password is incorrect',
      };
  }
};
export const signInWithGithub = async () => {
  await signIn('github', {
    redirectTo: '/',
  });
};

export const signUpWithEmailAndPassword = async (values: z.infer<typeof signUpSchema>) => {
  try {
    signUpSchema.parse(values);
  } catch (error) {
    return {
      message: 'Invalid Payload',
    };
  }

  const { email, password, csrfToken } = values;

  const queryParams = {
    TableName: 'users',
    IndexName: 'EmailIndex', // Use the email GSI for querying by email
    KeyConditionExpression: 'Email = :email',
    ExpressionAttributeValues: {
      ':email': { S: email },
    },
  };

  try {
    // Get user data from DynamoDB
    const userData = await dbClient.send(new QueryCommand(queryParams));
    if (userData.Items && userData.Items.length > 0) {
      return { message: 'User already exists' };
    }

    // Hash the password before storing it
    const hashedPassword = hashSync(password, 10);

    // Create new user if not exists
    const userId = uuid();
    const putParams = {
      TableName: 'users',
      Item: {
        UserId: { S: userId },
        Email: { S: email },
        Password: { S: hashedPassword }, // Note: Storing passwords in plain text is NOT recommended. Use a hashing mechanism.
      },
    };

    await dbClient.send(new PutItemCommand(putParams));
    await signIn('credentials', { email, password, csrfToken });
  } catch (err) {
    console.log(err);
    return { message: 'Error creating user', error: err };
  }
};
