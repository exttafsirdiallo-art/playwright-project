import { test, expect } from "@playwright/test";
import userData from "../data/users.json";

// toujours créer le compte manuellement avant
test.describe("TC04 Logout User @auth @smoke", () => {
  test("Test Case 4: Logout User JDD JSON", async ({ page }) => {
    const u5 = userData.newUser5;

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

    // Cliquer sur connexion
    await page.locator('a[href="/login"]').click();

    // Page connexion
    await expect(page.locator('[data-qa="login-email"]')).toBeVisible();

    await page.fill('[data-qa="login-email"]', u5.email);
    await page.fill('[data-qa="login-password"]', u5.password);

    await page.click('[data-qa="login-button"]');

    // Vérifier l'affichage du message d'erreur
    // Page HP
    await expect(
      page.locator(`li:has-text("Logged in as ${u5.signupName}")`)
    ).toBeVisible({ timeout: 10000 });

    // Se deconnecter
    await page.locator('a[href="/logout"]').click();

    // Vérifier que le formulaire de connexion est visible après la déconnexion
    const loginForm = page.locator("div.login-form h2", {
      hasText: "Login to your account",
    });
    await expect(loginForm).toBeVisible({ timeout: 10000 });

    console.log(`✅ Test OK:`);
  });
});
