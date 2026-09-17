import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Plan Edit Journey', () => {
  test('should edit an existing plan', async ({ page }) => {
    await login(page);

    await page.click('text=Plan & Numbers');
    await expect(page).toHaveURL('/plans');
    await expect(page.getByText('Demo Operator')).toBeVisible();

    const editRowButton = page.locator('tr', { hasText: 'Demo Operator' }).getByRole('button', { name: 'Edit' });
    await Promise.all([
      page.waitForURL('/plans/1'),
      editRowButton.click(),
    ]);

    await page.getByRole('button', { name: 'Edit' }).click();

    await page.locator('input[value="Demo Operator"]').fill('Updated Operator');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Plan Details' })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('main')).toContainText('Updated Operator');
  });
});
