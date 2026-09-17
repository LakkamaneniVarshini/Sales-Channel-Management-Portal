import { test, expect } from '@playwright/test';
import { login, verifyOtpInModal } from './helpers';

test.describe('Commission Journey', () => {
  test('should create prepaid FRC commission with OTP', async ({ page }) => {
    await login(page);

    await page.click('text=Commission Config');
    await page.click('button:has-text("Add Commission")');
    await expect(page).toHaveURL(/\/commissions\/new/);

    await page.fill('#categoryId', '1');
    await page.fill('#masterCategoryId', '1');
    await page.fill('#denomination', '199');
    await page.fill('#commissionType', '1');
    await page.fill('#sellerCommission', '10');
    await page.fill('#fraCommission', '5');
    await page.fill('#subCommission', '2');
    await page.fill('#tds', '1');
    await page.selectOption('#circle', '1');

    await page.click('button:has-text("Send OTP & Create Commission")');
    await verifyOtpInModal(page);

    await expect(page).toHaveURL('/commissions');
  });
});
