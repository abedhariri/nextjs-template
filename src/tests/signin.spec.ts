import { createUser, deleteUser } from '@/user/db';
import { test, expect } from '@playwright/test';
import { hashSync } from 'bcryptjs';

test.beforeAll(async () => {
  await createUser('test@test.com', hashSync('SuperStrongPassword'));
});

test.afterAll(async () => {
  await deleteUser('test@test.com');
});

test('UI check', async ({ page }) => {
  await page.goto('/signin');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Create Next App');
  await expect(page.getByText('Sign in to create-saas')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'Sign in',
    })
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: /Github/i,
    })
  ).toBeVisible();

  await expect(
    page.getByRole('link', {
      name: 'sign up here!',
    })
  ).toHaveAttribute('href', '/signup');
});

test('Form validation', async ({ page }) => {
  await page.goto('/signin');

  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Invalid email')).toBeVisible();
  await expect(page.getByText('Password must be more than 8 characters')).toBeVisible();
});

test('Incorrect email or password', async ({ page }) => {
  await page.goto('/signin');

  await page.getByLabel('Email').fill('test@test.com');
  await page.getByLabel('Password').fill('SuperWeakPassword');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForResponse('/signin');
  await expect(page.getByText('Email or password is incorrect')).toBeVisible();
});

test('Successfully signin', async ({ page }) => {
  await page.goto('/signin');

  await page.getByLabel('Email').fill('test@test.com');
  await page.getByLabel('Password').fill('SuperStrongPassword');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForResponse('/signin');
  await expect(page).toHaveURL('/');
});

test('Signin with github provider', async ({ page }) => {
  await page.goto('/signin');
  await page.getByRole('button', { name: /Github/i }).click();
  await expect(page).toHaveURL(/github.com/i);
});
