import NextAuth from 'next-auth';
import { encode, decode } from 'next-auth/jwt';
import github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { DynamoDBAdapter } from '@auth/dynamodb-adapter';
import { dbClient } from './dynamodb';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/user/db';

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
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email as string, true);

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password!);

        if (!isPasswordValid) return null;

        return user;
      },
    }),
    github,
  ],
  pages: {
    signIn: '/signin',
  },
  trustHost: true,
});
