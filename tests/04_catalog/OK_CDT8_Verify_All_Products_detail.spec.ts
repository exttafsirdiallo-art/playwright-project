import { test, expect } from "@playwright/test";
import userData from "../data/users.json";
import { Page } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC08 Verify All Products and product detail page @catalog @smoke", () => {
  test("Test Case 8: Verify All Products and product detail page", async ({
    page,
  }) => {
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

    // Verifier que les indos du produit s'affiche

    const info = page.locator(".product-information");
    await expect(
      info.getByRole("heading", { name: /Blue Top/i })
    ).toBeVisible();
    await expect(info.getByText(/Category:\s*Women\s*>\s*Tops/i)).toBeVisible();
    await expect(info.getByText(/Rs\.\s*500/i)).toBeVisible();
    await expect(info.getByText(/Availability:\s*In Stock/i)).toBeVisible();
    await expect(info.getByText(/Condition:\s*New/i)).toBeVisible();
    await expect(info.getByText(/Brand:\s*Polo/i)).toBeVisible();

    console.log(`✅ Test OK:`);
  });
});
