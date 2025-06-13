import { test, expect } from '@playwright/test';

test('Inscription', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://ztrain-web.vercel.app/home');
  await page.getByRole('img', { name: 'user' }).click();
  await page.getByRole('tab', { name: "Inscription" }).click();

  const adresse = `test${Date.now()}@gmail.com`;

  await page.fill('#email_register', adresse);
  await page.fill('#password_register', 'test1234');
  await page.fill('#confirm_password_register', 'test1234');
  await page.click('#btn_register');

  // Wait for redirection to home page or modal to close
  await page.waitForLoadState('networkidle');

  // ✅ Confirm success via expected UI change (update this based on actual behavior)
  await expect(page.locator('text=Bienvenue')).toBeVisible({ timeout: 7000 });
});
