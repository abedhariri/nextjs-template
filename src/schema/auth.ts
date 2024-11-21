import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    csrfToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be more than 8 characters'),
  csrfToken: z.string(),
});
