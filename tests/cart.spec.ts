import { test, expect } from '@playwright/test';

test('Ajouter et supprimer un produit du panier', async ({ page }) => {
  // 1. Aller sur la page d’accueil
  await page.goto('https://ztrain-web.vercel.app/home');

  
  const firstProduct = page.locator('h5', {
    hasText: 'PC Portable 15.6"',
  }).first();

  await expect(firstProduct).toBeVisible({ timeout: 10_000 });

  
  await firstProduct.click();

 
  const addToCartButton = page.locator('.style_btn_add_cart__WFoN1');
  await expect(addToCartButton).toBeVisible();
  await addToCartButton.click();

  
  await page.locator('#style_content_cart_wrapper__mqNbf').click();


  const cartProductTitle = page.locator('.style_cart_product_wrapper__RsLvy h3');
  await expect(cartProductTitle).toContainText('PC Portable 15.6"', {
    timeout: 10_000,
  });


  const deleteBtn = page.locator('.style_trash_product_cart__7Yzni').first();
  await expect(deleteBtn).toBeVisible();
  await deleteBtn.click();

  
  const emptyMessage = page.locator('text=Votre panier est vide');
  await expect(emptyMessage).toBeVisible({ timeout: 5_000 });
});
