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

    //Scroller pour afficher le bas de page
    await page.locator("text=recommended items").scrollIntoViewIfNeeded();
    await expect(
      page.locator("h2.title.text-center", { hasText: "recommended items" })
    ).toBeVisible({ timeout: 10000 });

    // Cliquer sur add to cart

    // 🟢 Déclare d'abord le carrousel
    const carousel = page.locator("#recommended-item-carousel");

    // Bouton pour faire défiler (flèche droite)
    const nextBtn = carousel.locator(".right.recommended-item-control");

    // Sélecteurs du produit "Blue Top" dans la slide active
    const targetCardInActive = carousel.locator(".item.active .productinfo", {
      hasText: "Blue Top",
    });
    const targetAddBtnInActive = targetCardInActive.locator("a.add-to-cart");

    // S’assurer que le carrousel est visible
    await expect(carousel).toBeVisible({ timeout: 10000 });

    // Boucler jusqu’à ce que "Blue Top" apparaisse dans la slide active
    let found = false;
    for (let i = 0; i < 10; i++) {
      if (await targetCardInActive.isVisible()) {
        found = true;
        break;
      }
      await nextBtn.click();
      await page.waitForTimeout(400);
    }

    await expect(targetCardInActive).toBeVisible({ timeout: 5000 });

    // Survol et clic
    await targetAddBtnInActive.hover();
    await page.waitForTimeout(200);
    await targetAddBtnInActive.click();

    // Cliquer sur view cart
    // Attendre l’ouverture de la modale "Added!"
    const modal = page.locator(
      '.modal.show:has(.modal-title:has-text("Added!"))'
    );
    await expect(modal).toBeVisible({ timeout: 10000 });

    // Cliquer sur "View Cart" DANS la modale
    await modal.locator('a[href="/view_cart"]').click();

    // Vérifier la navigation vers la page panier
    await expect(page).toHaveURL(/\/view_cart$/, { timeout: 10000 });

    // Verifier la presence du panier dans le panier
    await expect(
      page.locator("tr#product-1", { hasText: u3.recherche })
    ).toBeVisible({ timeout: 10000 });

    console.log(`✅ Test OK:`);
  });
});
