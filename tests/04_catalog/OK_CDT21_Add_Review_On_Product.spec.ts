import { test, expect } from "@playwright/test";
import userData from "../data/users.json";
import { Page } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC21 Add review on product @catalog @smoke", () => {
  test("Test Case 21: Add review on product", async ({ page }) => {
    const u3 = userData.newUser3;

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

    // Afficher la PDP de la page
    await page.click('a[href="/product_details/1"]');

    // Scroller
    //Scroller pour afficher le bas de page
    await page.locator("#susbscribe_email").scrollIntoViewIfNeeded();

    await page.fill("#name", u3.firstName);
    await page.fill("#email", u3.email);
    await page.fill("#review", u3.message);

    await page.click("#button-review");

    await page.getByText("Thank you for your review.");

    console.log(`✅ Test OK:`);
  });
});
