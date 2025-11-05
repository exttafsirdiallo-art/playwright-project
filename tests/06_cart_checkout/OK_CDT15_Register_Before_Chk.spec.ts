import { test, expect } from "@playwright/test";
import userData from "../data/users.json";
import { Page } from "@playwright/test";
import { createAccount } from "../utils/account.ts";

import { fakerEN_US as faker } from "@faker-js/faker";

// Import des données perso à partir du fichier faker-data
import {
  email,
  motDePasse,
  prenom,
  nom,
  address,
  city,
  state,
  zipCode,
  phone,
} from "../data/faker-data.ts";

// toujours créer le compte manuellement avant
test.describe("TC15 Place Order: Register before Checkout @cart_checkout", () => {
  test("Test Case 15: Place Order: Register before Checkout JDD faker et JSON", async ({
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

    // Creation de compte

    // Cliquer sur connexion
    await page.locator('a[href="/login"]').click();

    // Page connexion
    await expect(page.locator('[data-qa="login-email"]')).toBeVisible();
    // Fonction création de compte qui se trouve dans utils=>accounts

    const user = await createAccount(page);

    // Cliquer sur le lien Products
    await page.click('a[href="/products"]');

    // Page All Products
    const contactTitle = page.locator("h2.title.text-center", {
      hasText: "All Products",
    });
    await expect(contactTitle).toBeVisible({ timeout: 10000 });

    // Cliquer sur le bouton "View Product"
    await Promise.all([
      page.waitForURL(/product_details\/1/, { timeout: 10000 }),
      page.click('a[href="/product_details/1"]'),
    ]);

    // Vérifier que la bonne page est ouverte
    await expect(page).toHaveURL(/product_details\/1/);

    await page.click('button:has-text("Add to cart")');

    // Cliquer sur le lien "View Cart"
    // Attendre que la modale de confirmation s’affiche
    const modalBody = page.locator(".modal-body");
    await expect(modalBody).toBeVisible({ timeout: 5000 });

    //Vérifier le message d’ajout au panier
    await expect(
      modalBody.getByText("Your product has been added to cart.")
    ).toBeVisible();

    //Cliquer sur le lien "View Cart"
    const viewCartLink = modalBody.locator('a[href="/view_cart"]');
    await expect(viewCartLink).toBeVisible({ timeout: 5000 });
    await viewCartLink.click();

    // Vérifier qu’on est bien redirigé vers la page du panier
    await expect(page).toHaveURL(/\/view_cart/, { timeout: 10000 });

    //Cliquer sur Checkout
    // 1) Cliquer sur "Proceed To Checkout" (pas d'attente d'URL ici)
    await page.click("a.btn.btn-default.check_out");

    // Attendre que le bloc adresse soit visible
    const delivery = page.locator("#address_delivery");
    await expect(delivery).toBeVisible({ timeout: 10000 });

    // Petite aide pour normaliser les espaces/retours à la ligne
    const normalize = (s: string) => s.replace(/\s+/g, " ").trim();

    // 1) Nom affiché (le HTML peut contenir ponctuation/espaces bizarres : on vérifie les deux morceaux)
    const nameEl = delivery.locator(".address_firstname.address_lastname");
    await expect(nameEl).toContainText(prenom);
    await expect(nameEl).toContainText(nom);

    // 2) Rue
    await expect(delivery).toContainText(address);

    // 3) Ville / État / Code postal (souvent dans le même <li> avec des \n)
    const cityStateZipEl = delivery.locator(
      ".address_city.address_state_name.address_postcode"
    );
    const cityStateZip = normalize(await cityStateZipEl.innerText());
    expect(cityStateZip).toContain(normalize(city));
    expect(cityStateZip).toContain(normalize(state));
    expect(cityStateZip).toContain(normalize(zipCode));

    // 4) Pays
    await expect(delivery.locator(".address_country_name")).toHaveText(
      u3.country
    );

    // 5) Téléphone (contains pour tolérer les formats + espaces)
    await expect(delivery.locator(".address_phone")).toContainText(phone);

    await expect(
      page.locator(".step-one .heading", { hasText: "Review Your Order" })
    ).toBeVisible({ timeout: 10000 });

    await page.fill('textarea[name="message"]', u3.message);
    await page.click('a[href="/payment"]');

    // Page paiement

    await expect(page.locator("h2.heading")).toHaveText("Payment", {
      timeout: 10000,
    });

    await page.fill('[data-qa="name-on-card"]', nom);
    await page.fill('[data-qa="card-number"]', u3.num_cb);
    await page.fill('[data-qa="cvc"]', u3.cvc);
    await page.fill('[data-qa="expiry-month"]', u3.mois);
    await page.fill('[data-qa="expiry-year"]', u3.annee);

    await page.click('button[data-qa="pay-button"]');

    //Page conf commande
    await expect(
      page.locator("p", {
        hasText: "Congratulations! Your order has been confirmed!",
      })
    ).toBeVisible({ timeout: 10000 });

    //Supprimer le compte
    await page.getByRole("link", { name: /Delete Account/i }).click();

    const deleteMsg = page.locator('[data-qa="account-deleted"]');
    await expect(deleteMsg).toBeVisible({ timeout: 10000 });
    await expect(deleteMsg).toHaveText(/Account Deleted!/i);

    await page.click('[data-qa="continue-button"]');

    console.log(`✅ Test OK:`);
  });
});
