import { test, expect } from "@playwright/test";

test.describe("TC18 View Category Products @catalog", () => {
  test("Test Case 18: View Category Products", async ({ page }) => {
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

    // Vérifier que l’onglet "Home" est visible et actif à l’arrivée sur le site
    const homeLink = page.locator('a[href="/"]', { hasText: "Home" });
    await expect(homeLink).toBeVisible({ timeout: 10000 });

    // Verifier que les catégories sont visibles
    await expect(page.getByRole("link", { name: "Women" })).toBeVisible();
    await expect(page.locator('a[href="#Men"]')).toBeVisible();
    await expect(page.locator('a[href="#Kids"]')).toBeVisible();

    // Ouvrir l'accordeon
    await page
      .locator('a[href="#Women"] span.badge.pull-right i.fa-plus')
      .click();

    //Cliquer sur dress
    await page.getByRole("link", { name: "Dress" }).click();

    // Page Catégorie
    const contactTitle = page.locator("h2.title.text-center", {
      hasText: "Women - Dress Products",
    });
    await expect(contactTitle).toBeVisible({ timeout: 10000 });

    // Cliquer sur l'accrodeons de Men
    await page
      .locator('a[href="#Men"] span.badge.pull-right i.fa-plus')
      .click();

    // Cliquer sur JEan
    await page.getByRole("link", { name: "Jeans" }).click();

    // Page catégorie
    await expect(
      page.locator("h2.title.text-center", { hasText: "Men - Jeans Products" })
    ).toBeVisible({ timeout: 10000 });

    console.log(`✅ Test OK:`);
  });
});
