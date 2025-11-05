import { test, expect } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC17 Remove Products From Cart @cart_checkout @smoke", () => {
  test("Test Case 17: Remove Products From Cart", async ({ page }) => {
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

    // Cliquer sur le bouton "View Product"
    await Promise.all([
      page.waitForURL(/product_details\/1/, { timeout: 10000 }),
      page.click('a[href="/product_details/1"]'),
    ]);

    // Vérifier que la bonne page est ouverte
    await expect(page).toHaveURL(/product_details\/1/);

    await page.click('button:has-text("Add to cart")');

    // Cliquer sur le lien "View Cart"
    // Attendre que la modale de confirmation s’affiche
    const modalBody = page.locator(".modal-body");
    await expect(modalBody).toBeVisible({ timeout: 5000 });

    //Vérifier le message d’ajout au panier
    await expect(
      modalBody.getByText("Your product has been added to cart.")
    ).toBeVisible();

    //Cliquer sur le lien "View Cart"
    const viewCartLink = modalBody.locator('a[href="/view_cart"]');
    await expect(viewCartLink).toBeVisible({ timeout: 5000 });
    await viewCartLink.click();

    // Vérifier qu’on est bien redirigé vers la page du panier
    await expect(page).toHaveURL(/\/view_cart/, { timeout: 10000 });

    // Supprimer l'article du panier
    await page.locator('a.cart_quantity_delete[data-product-id="1"]').click();

    await expect(
      page.getByText("Cart is empty!", { exact: false })
    ).toBeVisible({
      timeout: 10000,
    });

    console.log(`✅ Test OK:`);
  });
});
