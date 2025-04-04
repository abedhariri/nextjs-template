import NextAuth from 'next-auth';
import { encode, decode } from 'next-auth/jwt';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/user/db';
import PostgresAdapter from '@auth/pg-adapter';
import { pool } from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  session: {
    strategy: 'jwt',
  },
  jwt: { encode, decode },
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email' },
        password: { label: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email as string, true);

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isPasswordValid) return null;

        return user;
      },
    }),
    Github,
    Google,
  ],
  pages: {
    signIn: '/signin',
  },
  trustHost: true,
});
