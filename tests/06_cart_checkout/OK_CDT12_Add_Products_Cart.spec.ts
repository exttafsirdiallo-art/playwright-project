import { test, expect } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC12 Add Products in Cart @cart_checkout @smoke", () => {
  test("Test Case 12: Add Products in Cart", async ({ page }) => {
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

    // Cliquer sur le lien Products
    await page.click('a[href="/products"]');

    // Page All Products
    const productTitle = page.locator("h2.title.text-center", {
      hasText: "All Products",
    });
    await expect(productTitle).toBeVisible({ timeout: 10000 });

    // 1️⃣ Survoler la carte du produit pour faire apparaître le bouton
    await page.hover('div.productinfo:has([data-product-id="1"])');

    // 2️⃣ Attendre que le bouton "Add to cart" devienne visible
    const addToCartButton = page.locator('a[data-product-id="1"]').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // 1) Cibler la modale (le conteneur .modal qui contient ce contenu)
    const modal = page.locator('.modal:has(.modal-content:has-text("Added!"))');

    // S’assurer qu’elle est bien visible
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 2) Cliquer sur le bouton "Continue Shopping" DANS la modale
    const continueBtn = modal.getByRole("button", {
      name: "Continue Shopping",
    });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click(); // <- le clic déclenche le data-dismiss="modal"

    // 3) Attendre sa fermeture complète (modale + backdrop)
    await expect(modal).toBeHidden({ timeout: 10000 });
    await expect(page.locator(".modal-backdrop")).toHaveCount(0, {
      timeout: 10000,
    });

    // Pour le second produit
    // 1️⃣ Survoler la carte du produit pour faire apparaître le bouton
    await page.hover('div.productinfo:has([data-product-id="2"])');

    // 2️⃣ Attendre que le bouton "Add to cart" devienne visible
    const addToCartButtons = page.locator('a[data-product-id="2"]').first();
    await expect(addToCartButtons).toBeVisible();
    await addToCartButtons.click();

    // 1️⃣ Attendre que la modale de confirmation s’affiche
    const modalBody = page.locator(".modal-body");
    await expect(modalBody).toBeVisible({ timeout: 5000 });

    // 2️⃣ Vérifier le message d’ajout au panier
    await expect(
      modalBody.getByText("Your product has been added to cart.")
    ).toBeVisible();

    // 3️⃣ Cliquer sur le lien "View Cart"
    const viewCartLink = modalBody.locator('a[href="/view_cart"]');
    await expect(viewCartLink).toBeVisible({ timeout: 5000 });
    await viewCartLink.click();

    // 4️⃣ Vérifier qu’on est bien redirigé vers la page du panier
    await expect(page).toHaveURL(/\/view_cart/, { timeout: 10000 });

    // S'assurer que le corps du tableau est présent
    const tbody = page.locator("table#cart_info_table tbody");
    await expect(tbody).toBeVisible({ timeout: 10_000 });

    // Lignes
    const row1 = tbody.locator("#product-1");
    const row2 = tbody.locator("#product-2");

    // --- PRODUIT 1 ---
    await expect(row1.getByRole("link", { name: "Blue Top" })).toBeVisible();
    await expect(row1.locator(".cart_price p")).toHaveText("Rs. 500");
    await expect(row1.locator(".cart_quantity .disabled")).toHaveText("1");
    await expect(row1.locator(".cart_total .cart_total_price")).toHaveText(
      "Rs. 500"
    );

    // --- PRODUIT 2 ---
    await expect(row2.getByRole("link", { name: "Men Tshirt" })).toBeVisible();
    await expect(row2.locator(".cart_price p")).toHaveText("Rs. 400");
    await expect(row2.locator(".cart_quantity .disabled")).toHaveText("1");
    await expect(row2.locator(".cart_total .cart_total_price")).toHaveText(
      "Rs. 400"
    );

    // (Optionnel) Vérifier calculs: total = prix × quantité
    const rsToNumber = (s: string) => Number(s.replace(/[^\d.]/g, ""));

    // Produit 1
    const p1 = rsToNumber(await row1.locator(".cart_price p").innerText()); // 500
    const q1 = Number(
      await row1.locator(".cart_quantity .disabled").innerText()
    ); // 1
    const t1 = rsToNumber(
      await row1.locator(".cart_total .cart_total_price").innerText()
    ); // 500
    expect(t1).toBe(p1 * q1);

    // Produit 2
    const p2 = rsToNumber(await row2.locator(".cart_price p").innerText()); // 400
    const q2 = Number(
      await row2.locator(".cart_quantity .disabled").innerText()
    ); // 1
    const t2 = rsToNumber(
      await row2.locator(".cart_total .cart_total_price").innerText()
    ); // 400
    expect(t2).toBe(p2 * q2);

    console.log(`✅ Test OK:`);
  });
});
