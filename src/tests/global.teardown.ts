import { deleteUser } from '@/user/db';
import { test as teardown } from '@playwright/test';

teardown('Clean up db', async () => {
  await deleteUser('test@test.com');
  console.error('removed user');
});
