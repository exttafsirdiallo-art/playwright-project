import { test, expect } from "@playwright/test";
import userData from "../data/users.json";
import { Page } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC10 Verify Subscription in home page @subscription", () => {
  test("Test Case 10: Verify Subscription in home page JDD JSON", async ({
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

    //Scroller pour afficher le bas de page
    await page.locator("#susbscribe_email").scrollIntoViewIfNeeded();

    await page.fill("#susbscribe_email", u3.email);
    await page.click("#subscribe");

    // Le toast de succès après l'inscription newsletter
    const successToast = page.getByText(/You have been successfully/i);

    // 1) Attendre qu'il apparaisse (court timeout car c'est instantané)
    await expect(successToast).toBeVisible({ timeout: 5000 });

    // 2) (Optionnel) Vérifier le texte exact
    await expect(successToast).toHaveText(/You have been successfully/i);

    // 3) Attendre qu'il disparaisse (toast qui s'auto-cache)
    await expect(successToast).toBeHidden({ timeout: 10000 });

    console.log(`✅ Test OK:`);
  });
});
