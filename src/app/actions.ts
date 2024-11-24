'use server';

import { signIn } from '@/lib/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { hashSync } from 'bcryptjs';
import { z } from 'zod';
import { signInSchema, signUpSchema } from '@/schema/auth';
import { createUser, getUserByEmail } from '@/user/db';

export const signInWithEmailAndPassword = async (formData: z.infer<typeof signInSchema>) => {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (isRedirectError(error)) redirect('/');
    return {
      message: 'Email or password is incorrect',
    };
  }
};

export const signInWithGithub = async () => {
  await signIn('github', {
    redirect: true,
    redirectTo: '/',
  });
};

export const signInWithGoogle = async () => {
  await signIn('google', {
    redirect: true,
    redirectTo: '/',
  });
};

export const signUpWithEmailAndPassword = async (values: z.infer<typeof signUpSchema>) => {
  try {
    signUpSchema.parse(values);
    const { email, password, csrfToken } = values;
    const userData = await getUserByEmail(email);

    if (userData) throw new Error('User already exists');

    const hashedPassword = hashSync(password, 10);

    await createUser(email, hashedPassword);
    await signIn('credentials', { email, password, csrfToken, redirectTo: '/' });
  } catch (err) {
    if (isRedirectError(err)) redirect('/');
    if (err instanceof Error) return { message: err.message };
    return { message: 'Something went wrong, and we are fixing it!' };
  }
};
