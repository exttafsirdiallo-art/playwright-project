import { test, expect } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC13 Verify Product quantity in Cart @cart_checkout @smoke", () => {
  test("Test Case 13: Verify Product quantity in Cart", async ({ page }) => {
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

    // Cliquer sur le bouton "View Product"
    await Promise.all([
      page.waitForURL(/product_details\/1/, { timeout: 10000 }),
      page.click('a[href="/product_details/1"]'),
    ]);

    // Vérifier que la bonne page est ouverte
    await expect(page).toHaveURL(/product_details\/1/);

    //Cliquer sur le champs quantité
    // Localiser l’élément par son id
    const quantityInput = page.locator("#quantity");

    // Attendre que le champ soit visible
    await expect(quantityInput).toBeVisible();

    // Cliquer sur le champ
    await quantityInput.click();

    // Effacer le 1
    await page.keyboard.press("Backspace");

    // Saisir le 4
    await page.fill("#quantity", "4");

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

    await expect(page.locator(".cart_quantity button.disabled")).toHaveText(
      "4",
      {
        timeout: 5000,
      }
    );

    console.log(`✅ Test OK:`);
  });
});
