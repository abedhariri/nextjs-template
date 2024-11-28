import { createUser } from '@/user/db';
import { test as setup } from '@playwright/test';
import { hashSync } from 'bcryptjs';

setup('Setup db', async () => {
  await createUser('test@test.com', hashSync('SuperStrongPassword'));
});
