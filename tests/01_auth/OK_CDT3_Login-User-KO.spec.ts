import { test, expect } from "@playwright/test";
import userData from "../data/users.json";

// toujours créer le compte manuellement avant
test.describe("TC03 Login User with incorrect email @auth @smoke", () => {
  test("Test Case 3: Login User with incorrect email and password", async ({
    page,
  }) => {
    const u2 = userData.newUser2;

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

    await page.fill('[data-qa="login-email"]', u2.email);
    await page.fill('[data-qa="login-password"]', u2.password);

    await page.click('[data-qa="login-button"]');

    // Vérifier l'affichage du message d'erreur
    const errorMsg = page.locator("p", {
      hasText: "Your email or password is incorrect!",
    });
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
    await expect(errorMsg).toHaveText("Your email or password is incorrect!");

    console.log(`✅ Test OK:`);
  });
});
