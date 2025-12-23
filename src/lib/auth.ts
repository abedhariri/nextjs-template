import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/server/db';
import { headers } from 'next/headers';
import { nextCookies } from 'better-auth/next-js';
import { compareSync, hashSync } from 'bcryptjs';

export type Session = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => hashSync(password),
      verify: async (data) => compareSync(data.password, data.hash),
    },
  },
  plugins: [nextCookies()],
  trustHost: true,
});

export const getSession = async () =>
  await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
