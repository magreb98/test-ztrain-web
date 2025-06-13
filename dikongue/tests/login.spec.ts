import { test, expect } from '@playwright/test';

test('Connexion utilisateur', async ({ page }) => {
    await page.goto('https://ztrain-web.vercel.app/home');

    await page.getByRole('img', { name: 'user' }).click();

    //Cliquer sur Connexion
    await page.getByRole('tab', { name: 'Connexion' }).click();

    await page.fill('#email_login', `test@gmail.com`); 
    await page.fill('#password_login', 'test1234'); 

    await page.click('#btn_login');

    await expect(page.locator('p.MuiTypography-root')).toHaveText("test@gmail.com");
});
