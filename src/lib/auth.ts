import NextAuth from 'next-auth';
import { encode, decode } from 'next-auth/jwt';
import github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { DynamoDBAdapter } from '@auth/dynamodb-adapter';
import { dbClient } from './dynamodb';
import { GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DynamoDBAdapter(dbClient),
  session: {
    strategy: 'jwt',
  },
  jwt: { encode, decode },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email' },
        password: { label: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log(credentials);

        // Prepare parameters to query the DynamoDB Users table
        const queryParams = {
          TableName: 'users',
          IndexName: 'EmailIndex', // Use the email GSI for querying by email
          KeyConditionExpression: 'Email = :email',
          ExpressionAttributeValues: {
            ':email': { S: credentials.email as string },
          },
        };

        try {
          // Get user data from DynamoDB
          const userData = await dbClient.send(new QueryCommand(queryParams));

          console.log(userData);

          if (!userData.Items) {
            console.log('User does not exist.');
            return null;
          }

          console.log(userData);
          // Extract hashed password from the database
          const hashedPassword = userData.Items[0].Password.S;

          // Compare the provided password with the hashed password
          const isPasswordValid = await bcrypt.compare(credentials.password as string, hashedPassword!);

          if (!isPasswordValid) {
            console.log('Invalid password.');
            return null;
          }

          const user = {
            email: userData.Items[0].Email.S,
            name: userData.Items[0].Name?.S || (credentials.email as string),
            id: userData.Items[0].UserId.S,
          };
          // Return user information if authentication is successful
          console.log(user);
          return user;
        } catch (err) {
          console.error('Error during user authorization', err);
          return null;
        }
      },
    }),
    github,
  ],
  pages: {
    signIn: '/signin',
  },
  trustHost: true,
});
