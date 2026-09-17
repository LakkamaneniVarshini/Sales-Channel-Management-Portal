import { test, expect } from '@playwright/test';
import { login, verifyOtpInModal } from './helpers';

test.describe('Commission Edit Journey', () => {
  test('should search, edit commission, and verify with OTP', async ({ page }) => {
    await login(page);

    await page.click('text=Commission Config');
    await expect(page).toHaveURL('/commissions');

    await page.click('button:has-text("Search")');
    await expect(page.getByText('mock-commission-1')).toBeVisible();

    const editRowButton = page.locator('tr', { hasText: 'mock-commission-1' }).getByRole('button', { name: 'Edit' });
    await Promise.all([
      page.waitForURL(/\/commissions\/mock-commission-1/),
      editRowButton.click(),
    ]);

    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    await verifyOtpInModal(page);

    await expect(page.getByRole('heading', { name: 'Commission Details' })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('main')).toContainText('mock-commission-1');
  });
});
