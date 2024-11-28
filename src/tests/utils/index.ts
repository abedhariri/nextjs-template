import { expect, Page } from '@playwright/test';

export const expectToastWithMessage = async (message: string, page: Page) => {
  let atLeastOneVisible = false;
  const messages = await page.getByText(message).all();
  for (const message of messages) {
    if (await message.isVisible()) {
      atLeastOneVisible = true;
      break;
    }
  }
  expect(atLeastOneVisible).toBe(true);
};
