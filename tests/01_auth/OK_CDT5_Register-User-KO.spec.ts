import { test, expect } from "@playwright/test";
import userData from "../data/users.json";

// toujours créer le compte manuellement avant
test.describe("TC05 Register User with existing email @auth", () => {
  test("Test Case 5: Register User with existing email JDD JSON @auth", async ({
    page,
  }) => {
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

    // Cliquer sur connexion
    await page.locator('a[href="/login"]').click();

    // Page connexion
    await expect(page.locator('[data-qa="login-email"]')).toBeVisible();

    await page.fill('[data-qa="signup-name"]', u3.firstName);
    await page.fill('[data-qa="signup-email"]', u3.email);

    await page.click('[data-qa="signup-button"]');

    // Vérifier que le message d’erreur s’affiche
    await expect(
      page.locator("p", { hasText: "Email Address already exist!" })
    ).toBeVisible({ timeout: 10000 });

    console.log(`✅ Test OK:`);
  });
});
