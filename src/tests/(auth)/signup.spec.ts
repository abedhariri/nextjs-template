import { test, expect } from '@playwright/test';

test('UI check', async ({ page }) => {
  await page.goto('/signup');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Create Next App');
  await expect(page.getByText('Sign up for create-saas')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(
    page.getByLabel('Password', {
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByLabel('Confirm Password', {
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'Sign up',
    })
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: /Github/i,
    })
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: /Google/i,
    })
  ).toBeVisible();

  await expect(
    page.getByRole('link', {
      name: 'sign in here!',
    })
  ).toHaveAttribute('href', '/signin');
});

test('Form validation', async ({ page }) => {
  await page.goto('/signup');

  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByText('Invalid email')).toBeVisible();

  const passwordElements = await page.getByText('Password must be more than 8 characters', { exact: true }).all();
  expect(passwordElements).toHaveLength(2);
});

test('Incorrect password and confirm password', async ({ page }) => {
  await page.goto('/signup');

  await page.getByLabel('Email').fill('test@test.com');
  await page.getByLabel('Password', { exact: true }).fill('SuperWeakPassword');
  await page.getByLabel('Confirm Password', { exact: true }).fill('SuperWeaksPassword');
  await page.getByRole('button', { name: 'Sign up' }).click();
  expect(page.getByText('Passwords do not match', { exact: true })).toBeVisible();
});

test('Successfully signup', async ({ page, browserName }) => {
  await page.goto('/signup');

  await page.getByLabel('Email').fill(`${browserName}@test.com`);
  await page.getByLabel('Password', { exact: true }).fill('SuperStrongPassword');
  await page.getByLabel('Confirm Password', { exact: true }).fill('SuperStrongPassword');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page).toHaveURL('/');
});
test('Signup with already existing email', async ({ page }) => {
  await page.goto('/signup');

  await page.getByLabel('Email').fill('test@test.com');
  await page.getByLabel('Password', { exact: true }).fill('SuperStrongPassword');
  await page.getByLabel('Confirm Password', { exact: true }).fill('SuperStrongPassword');
  await page.getByRole('button', { name: 'Sign up' }).click();
  expect(page.getByText('User already exists', { exact: true })).toBeVisible({ timeout: 5000 });
});

test('Signin with github provider', async ({ page }) => {
  await page.goto('/signup');
  await page.getByRole('button', { name: /Github/i }).click();
  await expect(page).toHaveURL(/github.com/i);
});

test('Signin with google provider', async ({ page }) => {
  await page.goto('/signup');
  await page.getByRole('button', { name: /Google/i }).click();
  await expect(page).toHaveURL(/google.com/i);
});
