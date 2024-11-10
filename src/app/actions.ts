'use server';

import { signIn } from '@/lib/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

export const signInWithEmailAndPAssword = async (_previousState: { message: string }, formData: FormData) => {
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
