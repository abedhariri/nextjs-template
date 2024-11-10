'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActionState, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { signInWithEmailAndPAssword } from '@/app/actions';
import { getCsrfToken } from 'next-auth/react';

const initialState = {
  message: '',
};

function EmailPasswordForm() {
  const [token, setToken] = useState('');
  const [state, formAction, isPending] = useActionState(signInWithEmailAndPAssword, initialState);

  useEffect(() => {
    (async function getToken() {
      const token = await getCsrfToken();
      setToken(token);
    })();
  }, []);

  return (
    <>
      {state?.message && (
        <div className="w-full text-center">
          <p className="text-red-500 text-sm">{state.message}</p>
        </div>
      )}
      <form action={formAction} className="w-full space-y-4">
        <input hidden value={token} readOnly />
        <Label htmlFor="email">
          Email
          <Input type="email" name="email" required />
        </Label>
        <Label>
          Password
          <Input type="password" name="password" required />
        </Label>
        <Button type="submit" className="w-full">
          {isPending ? '...loading' : 'Sign In'}
        </Button>
      </form>
    </>
  );
}

export default EmailPasswordForm;
