import { test, expect } from "@playwright/test";
import userData from "../data/users.json";
import { Page } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC20: Search Products and Verify Cart After Login @cart_checkout", () => {
  test("Test Case 20: Search Products and Verify Cart After Login", async ({
    page,
  }) => {
    const u6 = userData.newUser6;

    // 1️⃣ Accède à la page d’accueil
    await page.goto("https://automationexercise.com", {
      waitUntil: "domcontentloaded",
    });
    await page
      .locator('button:has-text("OK")')
      .click({ timeout: 5000 })
      .catch(() => {});

    await page
      .locator(
        'button.fc-button.fc-cta-consent[aria-label="Consent"], button.fc-button.fc-cta-consent:has-text("Consent")'
      )
      .click({ timeout: 3000 })
      .catch(() => {});

    // Verifier qu'on est sur la HP
    // Vérifier que l’onglet "Home" est visible et actif à l’arrivée sur le site
    const homeLink = page.locator('a[href="/"]', { hasText: "Home" });
    await expect(homeLink).toBeVisible({ timeout: 10000 });

    // Cliquer sur le lien Products
    await page.click('a[href="/products"]');

    // Page All Products
    const contactTitle = page.locator("h2.title.text-center", {
      hasText: "All Products",
    });
    await expect(contactTitle).toBeVisible({ timeout: 10000 });

    // Saisir Blue top dans la barre de recherche
    await page
      .locator('input[placeholder="Search Product"]')
      .fill(u6.recherche);

    // Vlaider la recherche
    await page.locator("button#submit_search").click();

    await expect(
      page.getByText("Searched Products", { exact: false })
    ).toBeVisible({ timeout: 10000 });

    // Verifier qu'on a le bon produit
    await expect(page.locator(".productinfo.text-center p")).toHaveText(
      u6.recherche
    );
    // Afficher la PDP de la page
    await page.click('a[href="/product_details/1"]');

    // Clic ajout panier
    const addToCart = page.locator("button.btn.btn-default.cart");
    await expect(addToCart).toBeVisible({ timeout: 10000 });
    await addToCart.click();

    // Cliquer sur continuer shoppin
    // 1) Cibler la modale (le conteneur .modal qui contient ce contenu)
    const modal = page.locator('.modal:has(.modal-content:has-text("Added!"))');

    // S’assurer qu’elle est bien visible
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 2) Cliquer sur le bouton "Continue Shopping" DANS la modale
    const continueBtn = modal.getByRole("button", {
      name: "Continue Shopping",
    });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click(); // <- le clic déclenche le data-dismiss="modal"

    // 3) Attendre sa fermeture complète (modale + backdrop)
    await expect(modal).toBeHidden({ timeout: 10000 });
    await expect(page.locator(".modal-backdrop")).toHaveCount(0, {
      timeout: 10000,
    });

    // Aller au panier

    await page.click('a[href="/view_cart"]');
    // Vérifier qu’on est bien redirigé vers la page du panier
    await expect(page).toHaveURL(/\/view_cart/, { timeout: 10000 });

    // Verifier la presence du panier dans le panier
    await expect(
      page.locator("tr#product-1", { hasText: u6.recherche })
    ).toBeVisible({ timeout: 10000 });

    // Se connecter
    // Cliquer sur connexion
    await page.getByRole("link", { name: /signup \/ login/i }).click();

    // Page connexion
    await expect(page.locator('[data-qa="login-email"]')).toBeVisible({
      timeout: 10000,
    });

    await page.fill('[data-qa="login-email"]', u6.email);
    await page.fill('[data-qa="login-password"]', u6.password);

    await page.click('[data-qa="login-button"]');

    // Vérifier l'affichage du message d'erreur
    // Page HP
    await expect(
      page.locator(`li:has-text("Logged in as ${u6.signupName}")`)
    ).toBeVisible({ timeout: 10000 });

    // Retour sur le panier et verifier que le produit est toujours dans le panier
    // Aller au panier

    await page.click('a[href="/view_cart"]');
    // Vérifier qu’on est bien redirigé vers la page du panier
    await expect(page).toHaveURL(/\/view_cart/, { timeout: 10000 });

    // Verifier la presence du panier dans le panier
    await expect(
      page.locator("tr#product-1", { hasText: u6.recherche })
    ).toBeVisible({ timeout: 10000 });

    console.log(`✅ Test OK:`);
  });
});
