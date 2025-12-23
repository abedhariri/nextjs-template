'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { signInWithEmailAndPassword } from '@/app/actions';
import { signInSchema } from '@/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useToast } from '@/hooks/use-toast';

function EmailPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setError(null);
    startTransition(async () => {
      const result = await signInWithEmailAndPassword(values);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
      {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signin-email">Email</FieldLabel>
              <Input {...field} id="signin-email" type="email" aria-invalid={fieldState.invalid} autoComplete="email" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signin-password">Password</FieldLabel>
              <Input
                {...field}
                id="signin-password"
                type="password"
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '...loading' : 'Sign In'}
      </Button>
    </form>
  );
}

export default EmailPasswordForm;
