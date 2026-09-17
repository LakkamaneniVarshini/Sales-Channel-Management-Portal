import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'testpass');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
}

export async function verifyOtpInModal(page: Page) {
  await expect(page.getByText(/OTP Verification/i)).toBeVisible();
  await page.fill('#otp', '123456');
  await page.getByRole('button', { name: /Verify/i }).click();
}
