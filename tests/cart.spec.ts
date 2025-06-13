import { test, expect } from '@playwright/test';

test.describe('Tests du panier e-commerce - Ztrain Web', () => {
  test.beforeEach(async ({ page }) => {
    // Configuration pour éviter les timeouts
    page.setDefaultTimeout(45000);
    
    // Aller à la page d'accueil et attendre le chargement complet
    await page.goto('https://ztrain-web.vercel.app/home');
    await page.waitForLoadState('networkidle');
    
    // Attendre que les produits soient chargés
    await page.waitForSelector('img.style_card_body_img__mkV1D', { timeout: 15000 });
  });

  test('Ajout d\'un produit au panier', async ({ page }) => {
    console.log(' Début du test d\'ajout au panier');
    
    // Étape 1: Vérifier que les produits sont présents
    const products = await page.$$('img.style_card_body_img__mkV1D');
    console.log(`Nombre de produits trouvés: ${products.length}`);
    expect(products.length).toBeGreaterThan(0);
    
    // Étape 2: Sélectionner un produit spécifique (le premier pour la cohérence)
    const firstProduct = page.locator('img.style_card_body_img__mkV1D').first();
    await expect(firstProduct).toBeVisible();
    
    // Cliquer sur le produit avec gestion d'erreur
    try {
      await firstProduct.click({ timeout: 10000 });
      console.log('Clic sur le produit réussi');
    } catch (error) {
      console.log('Erreur lors du clic sur le produit, tentative avec scroll');
      await firstProduct.scrollIntoViewIfNeeded();
      await firstProduct.click({ force: true });
    }
    
    // Étape 3: Attendre le chargement de la page produit
    await page.waitForLoadState('networkidle');
    
    // Étape 4: Ajouter au panier
    await page.waitForSelector('button:has-text("Ajouter au panier")', { timeout: 10000 });
    await page.click('button:has-text("Ajouter au panier")');
    console.log('Produit ajouté au panier');
    
    // Étape 5: Vérifier que le panier est mis à jour
    await page.waitForTimeout(1000);
    
    // Vérifier que l'icône du panier est présente et cliquable
    await page.waitForSelector('#style_content_cart_wrapper__mqNbf', { timeout: 10000 });
    const cartIcon = page.locator('#style_content_cart_wrapper__mqNbf');
    await expect(cartIcon).toBeVisible();
    
    console.log('Test d\'ajout au panier terminé avec succès');
  });

  test('Suppression d\'un produit du panier', async ({ page }) => {
    console.log('Début du test de suppression du panier');
    
    // Pré-requis: Ajouter d'abord un produit au panier
    const products = await page.$$('img.style_card_body_img__mkV1D');
    expect(products.length).toBeGreaterThan(0);
    
    const firstProduct = page.locator('img.style_card_body_img__mkV1D').first();
    await expect(firstProduct).toBeVisible();
    
    // Cliquer sur le produit avec gestion d'erreur
    try {
      await firstProduct.click({ timeout: 10000 });
    } catch (error) {
      await firstProduct.scrollIntoViewIfNeeded();
      await firstProduct.click({ force: true });
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('button:has-text("Ajouter au panier")', { timeout: 10000 });
    await page.click('button:has-text("Ajouter au panier")');
    await page.waitForTimeout(1000);
    
    // Étape 1: Ouvrir le panier
    await page.waitForSelector('#style_content_cart_wrapper__mqNbf', { timeout: 10000 });
    await page.click('#style_content_cart_wrapper__mqNbf');
    console.log('Panier ouvert');
    
    // Étape 2: Attendre que le drawer du panier soit ouvert
    await page.waitForSelector('.ant-drawer-body', { timeout: 10000 });
    
    // Étape 3: Vérifier que le produit est dans le panier
    const deleteBtn = page.locator('.style_trash_product_cart__7Yzni').first();
    await expect(deleteBtn).toBeVisible({ timeout: 10000 });
    
    // Étape 4: Supprimer le produit
    await deleteBtn.click();
    console.log('Produit supprimé du panier');
    
    // Étape 5: Vérifier que le panier est vide
    const emptyMessage = page.locator('text=Votre panier est vide');
    await expect(emptyMessage).toBeVisible({ timeout: 10000 });
    
    console.log('Test de suppression terminé avec succès');
  });

  test('Parcours complet: Ajout puis suppression d\'un produit', async ({ page }) => {
    console.log('Début du test de parcours complet');
    
    // Phase 1: Ajout au panier
    const products = await page.$$('img.style_card_body_img__mkV1D');
    expect(products.length).toBeGreaterThan(0);
    
    const firstProduct = page.locator('img.style_card_body_img__mkV1D').first();
    await expect(firstProduct).toBeVisible();
    
    // Cliquer sur le produit avec gestion robuste
    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.click({ timeout: 10000 });
    
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('button:has-text("Ajouter au panier")', { timeout: 10000 });
    await page.click('button:has-text("Ajouter au panier")');
    await page.waitForTimeout(1000);
    
    console.log('Phase 1: Produit ajouté au panier');
    
    // Phase 2: Vérification et suppression
    await page.waitForSelector('#style_content_cart_wrapper__mqNbf', { timeout: 10000 });
    await page.click('#style_content_cart_wrapper__mqNbf');
    
    await page.waitForSelector('.ant-drawer-body', { timeout: 10000 });
    
    const deleteBtn = page.locator('.style_trash_product_cart__7Yzni').first();
    await expect(deleteBtn).toBeVisible({ timeout: 10000 });
    await deleteBtn.click();
    
    const emptyMessage = page.locator('text=Votre panier est vide');
    await expect(emptyMessage).toBeVisible({ timeout: 10000 });
    
    console.log('Phase 2: Produit supprimé du panier');
    console.log('Parcours complet terminé avec succès');
  });

  test('Test avec produit aléatoire (version corrigée)', async ({ page }) => {
    console.log('Début du test avec produit aléatoire');
    
    // Étape 1: Récupérer tous les produits
    const products = await page.$$('img.style_card_body_img__mkV1D');
    expect(products.length).toBeGreaterThan(0);
    console.log(`${products.length} produits disponibles`);
    
    // Étape 2: Sélectionner un produit aléatoire
    const randomIndex = Math.floor(Math.random() * products.length);
    console.log(`Sélection du produit n°${randomIndex + 1}`);
    
    const randomProduct = page.locator('img.style_card_body_img__mkV1D').nth(randomIndex);
    await expect(randomProduct).toBeVisible();
    
    // Étape 3: Cliquer sur le produit avec gestion robuste
    await randomProduct.scrollIntoViewIfNeeded();
    await randomProduct.click({ timeout: 15000 });
    
    await page.waitForLoadState('networkidle');
    
    // Étape 4: Ajouter au panier
    await page.waitForSelector('button:has-text("Ajouter au panier")', { timeout: 10000 });
    await page.click('button:has-text("Ajouter au panier")');
    await page.waitForTimeout(1000);
    
    // Étape 5: Ouvrir le panier et supprimer
    await page.waitForSelector('#style_content_cart_wrapper__mqNbf', { timeout: 10000 });
    await page.click('#style_content_cart_wrapper__mqNbf');
    
    await page.waitForSelector('.ant-drawer-body', { timeout: 10000 });
    
    const deleteBtn = page.locator('.style_trash_product_cart__7Yzni').first();
    await expect(deleteBtn).toBeVisible({ timeout: 10000 });
    await deleteBtn.click();
    
    const emptyMessage = page.locator('text=Votre panier est vide');
    await expect(emptyMessage).toBeVisible({ timeout: 10000 });
    
    console.log('Test avec produit aléatoire terminé avec succès');
  });
});
