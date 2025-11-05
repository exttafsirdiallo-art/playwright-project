import { test, expect } from "@playwright/test";
import userData from "../data/users.json";
import { Page } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality @scroll @smoke", () => {
  test("Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async ({
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
    //Localiser le texte du footer
    const footer = page.locator("p.pull-left", {
      hasText: "Copyright © 2021 All rights reserved",
    });

    //Faire défiler la page jusqu’à cet élément
    await footer.scrollIntoViewIfNeeded();

    //Vérifier que l’élément est bien visible
    await expect(footer).toBeVisible({ timeout: 10000 });

    // Cliquer sur le bouton pour remonter

    const scrollUpBtn = page.locator("a#scrollUp");
    await expect(scrollUpBtn).toBeVisible({ timeout: 5000 });
    await scrollUpBtn.click();
    await page.waitForTimeout(1000);

    // Vérifier que le logo en haut de la page est visible
    await expect(
      page.locator(
        'div.logo.pull-left img[alt="Website for automation practice"]'
      )
    ).toBeVisible({ timeout: 10000 });

    console.log(`✅ Test OK:`);
  });
});
