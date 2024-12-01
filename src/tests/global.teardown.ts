import { deleteUser } from '@/user/db';
import { test as teardown } from '@playwright/test';

teardown('Clean up db', async () => {
  await deleteUser('test@test.com');
  await deleteUser('chromium@test.com');
  await deleteUser('firefox@test.com');
  await deleteUser('webkit@test.com');
});
