import { test, expect } from "@playwright/test";
import userData from "../data/users.json";

// toujours créer le compte manuellement avant
test.describe("TC02 Login @auth @smoke", () => {
  test("Test Case 2: Login User with correct email and password JSON", async ({
    page,
  }) => {
    const u = userData.newUser;

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

    await page.fill('[data-qa="login-email"]', u.email);
    await page.fill('[data-qa="login-password"]', u.password);

    await page.click('[data-qa="login-button"]');

    // Page HP
    await expect(
      page.locator(`li:has-text("Logged in as ${u.signupName}")`)
    ).toBeVisible({ timeout: 10000 });

    //Supprimer le compte
    //await page.getByRole("link", { name: /Delete Account/i }).click();

    /*const deleteMsg = page.locator('[data-qa="account-deleted"]');
  await expect(deleteMsg).toBeVisible({ timeout: 10000 });
  await expect(deleteMsg).toHaveText(/Account Deleted!/i);

  await page.click('[data-qa="continue-button"]');*/

    console.log(`✅ Test OK:`);
  });
});
