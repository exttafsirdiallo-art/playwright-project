import { test, expect } from "@playwright/test";
import userData from "../data/users.json";
import { Page } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC09 Search Product @catalog @smoke", () => {
  test("Test Case 9: Search Product", async ({ page }) => {
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

    // Saisir Blue top dans la barre de recherche
    await page
      .locator('input[placeholder="Search Product"]')
      .fill(u3.recherche);

    // Vlaider la recherche
    await page.locator("button#submit_search").click();

    await expect(
      page.getByText("Searched Products", { exact: false })
    ).toBeVisible({ timeout: 10000 });

    // Verifier qu'on a le bon produit
    await expect(page.locator(".productinfo.text-center p")).toHaveText(
      u3.recherche
    );

    console.log(`✅ Test OK:`);
  });
});
