import { test, expect } from '@playwright/test';

test('Ajout et suppression d’un produit au panier', async ({ page }) => {
  // Aller sur le site
  await page.goto('https://ztrain-web.vercel.app/home');

  // Ouvrir le menu utilisateur et se connecter
  await page.getByRole('img', { name: 'user' }).click();
  await page.getByRole('tab', { name: 'Connexion' }).click();

  await page.fill('#email_login', `test@gmail.com`);
  await page.fill('#password_login', 'test1234');
  await page.click('#btn_login');

  // Attendre que la connexion soit effective (par exemple la présence du bouton "Déconnexion")
  await expect(page.locator('text=Déconnexion')).toBeVisible();

  // Cliquer sur un produit
  await page.locator('div.style_card_body__QuFGN').first().click();

  // Ajouter au panier
  await page.click('#style_btn_add_cart__gTXM7');
  await expect(page.locator('div.ant-notification-notice-message')).toHaveText("Ajout produit au panier");

  // Ouvrir le panier
  await page.getByRole('img', { name: 'cart' }).click();

  // Supprimer le produit (clic sur la poubelle)
  const deleteButton = page.locator('.style_delete_icon__D7Uu2').first(); // classe visible dans le panier
  await deleteButton.click();

  // Vérifier que le panier est vide
  await expect(page.locator('text=Votre panier est vide')).toBeVisible();
});
