import { test, expect } from '@playwright/test';

test('Ajouter un article aléatoire au panier et commander', async ({ page }) => {
  await page.goto('https://ztrain-web.vercel.app/home');


  const products = await page.$$('img.style_card_body_img__mkV1D');

 
  expect(products.length).toBeGreaterThan(0);


  const randomProduct = products[Math.floor(Math.random() * products.length)];

  await randomProduct.click();

  
  await page.waitForLoadState('networkidle');


  await page.waitForSelector('button:has-text("Ajouter au panier")');
  await page.click('button:has-text("Ajouter au panier")');

  await page.waitForTimeout(1000);


  await page.waitForSelector('#style_content_cart_wrapper__mqNbf');
  await page.click('#style_content_cart_wrapper__mqNbf');

  await page.waitForSelector('.ant-drawer-body');
  const deleteBtn = page.locator('.style_trash_product_cart__7Yzni').first();
  await expect(deleteBtn).toBeVisible();
  await deleteBtn.click();

  
  const emptyMessage = page.locator('text=Votre panier est vide');
  await expect(emptyMessage).toBeVisible({ timeout: 5_000 })
});
