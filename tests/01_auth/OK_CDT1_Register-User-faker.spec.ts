import { test, expect } from "@playwright/test";
//import { fakerEN_US as faker } from '@faker-js/faker';
import userData from "../data/users.json";
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

//const signupName = faker.person.signupName();

// Les données perso
console.log(`${nom} ${prenom}`);
console.log(email);
console.log(`${address}, ${city}, ${state} ${zipCode}`);
console.log(phone);

test.describe("TC01 Register User @auth", () => {
  test("Test Case 1: Register User faker", async ({ page }) => {
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

    await page.fill('[data-qa="signup-name"]', nom);
    await page.fill('[data-qa="signup-email"]', email);

    await page.click('[data-qa="signup-button"]');

    await expect(page.getByText("Enter Account Information")).toBeVisible({
      timeout: 10000,
    });

    // Page creation de compte
    await page.click("#id_gender2");
    await page.fill("#password", motDePasse);
    await page.click("#newsletter");
    await page.click("#optin");
    await page.fill('[data-qa="first_name"]', nom);
    await page.fill('[data-qa="last_name"]', prenom);
    await page.fill('[data-qa="address"]', address);
    await page.selectOption('[data-qa="country"]', { label: u.country });
    await page.fill('[data-qa="state"]', state);
    await page.fill('[data-qa="city"]', city);
    await page.fill('[data-qa="zipcode"]', zipCode);
    await page.fill('[data-qa="mobile_number"]', phone);
    await page.click('[data-qa="create-account"]');

    // Confirmation création compte

    const message = page.locator('[data-qa="account-created"]');
    await expect(message).toBeVisible({ timeout: 10000 });
    await expect(message).toHaveText(/Account Created!/i);

    await page.click('[data-qa="continue-button"]');

    // Page HP
    await expect(
      page.locator(`li:has-text("Logged in as ${nom}")`)
    ).toBeVisible({
      timeout: 10000,
    });

    //Supprimer le compte
    await page.getByRole("link", { name: /Delete Account/i }).click();

    const deleteMsg = page.locator('[data-qa="account-deleted"]');
    await expect(deleteMsg).toBeVisible({ timeout: 10000 });
    await expect(deleteMsg).toHaveText(/Account Deleted!/i);

    await page.click('[data-qa="continue-button"]');

    console.log(`✅ Test OK:`);
  });
});
