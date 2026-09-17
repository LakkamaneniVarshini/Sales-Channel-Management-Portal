import { test, expect } from '@playwright/test';
import { login, verifyOtpInModal } from './helpers';

test.describe('Plan Journey', () => {
  test('should create a plan with OTP verification', async ({ page }) => {
    await login(page);

    await page.click('text=Plan & Numbers');
    await page.click('button:has-text("Add Plan")');
    await expect(page).toHaveURL('/plans/new');

    await page.fill('#operator', 'Demo Operator');
    await page.fill('#denomination', '199');
    await page.fill('#talkvalue', '199');
    await page.fill('#country', 'India');
    await page.selectOption('#type', 'Prepaid');
    await page.fill('#validity', '28 days');
    await page.fill('#description', 'Demo plan for testing');
    await page.fill('#tab_name', 'Popular');
    await page.selectOption('#circle', '1');
    await page.fill('#start_date', '2025-01-01');
    await page.fill('#end_date', '2026-01-01');
    await page.fill('#from_date', '2025-01-01');
    await page.fill('#to_date', '2026-01-01');

    await page.click('button:has-text("Send OTP & Create Plan")');
    await verifyOtpInModal(page);

    await expect(page).toHaveURL('/plans');
  });
});
