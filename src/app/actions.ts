'use server';

import { z } from 'zod';
import { signInSchema, signUpSchema } from '@/schema/auth';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const signInWithEmailAndPassword = async (
  credentials: z.infer<typeof signInSchema>
): Promise<{ error?: string }> => {
  try {
    await auth.api.signInEmail({
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return { error: 'Invalid email or password' };
    }
    return { error: 'An unexpected error occurred' };
  }

  redirect('/');
};

export const signUpWithEmailAndPassword = async (credentials: z.infer<typeof signUpSchema>) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email: credentials.email,
        name: 'test-user',
        password: credentials.password,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }

  redirect('/');
};
