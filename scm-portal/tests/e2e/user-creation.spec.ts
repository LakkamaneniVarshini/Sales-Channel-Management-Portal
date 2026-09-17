import { test, expect } from '@playwright/test';
import { login, verifyOtpInModal } from './helpers';

test.describe('User Creation Journey', () => {
  test('should complete user creation flow', async ({ page }) => {
    await login(page);

    await page.click('text=User Management');
    await expect(page).toHaveURL('/users');

    await page.click('button:has-text("Create User")');
    await expect(page).toHaveURL('/users/new');

    await page.fill('#hrmsId', '123456');
    await page.fill('#username', 'john.doe');
    await page.fill('#mobileNumber', '9876543210');
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#dob', '1990-01-01');
    await page.click('button:has-text("Next")');

    await page.fill('#address', '123 Sample Street');
    await page.selectOption('#zone', '1');
    await page.selectOption('#circle', '1');
    await page.selectOption('#ssa', '1');
    await page.click('button:has-text("Next")');

    await page.selectOption('#roleId', '3');
    await page.fill('#password', 'password123');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Send OTP & Create User")');

    await verifyOtpInModal(page);
    await expect(page).toHaveURL('/users');
  });

  test('should display dashboard metrics', async ({ page }) => {
    await login(page);

    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Active Users')).toBeVisible();
    await expect(page.locator('text=Total Dealers')).toBeVisible();
    await expect(page.locator('text=Active Dealers')).toBeVisible();
  });

  test('should navigate between modules', async ({ page }) => {
    await login(page);

    await page.click('text=User Management');
    await expect(page).toHaveURL('/users');

    await page.click('text=Dealer Management');
    await expect(page).toHaveURL('/dealers');

    await page.click('text=Commission Config');
    await expect(page).toHaveURL('/commissions');

    await page.click('text=Plan & Numbers');
    await expect(page).toHaveURL('/plans');
  });
});
