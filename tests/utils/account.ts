import { Page, expect } from "@playwright/test";
import * as fakerData from "../data/faker-data"; // ⚡ Import direct de tes données Faker

export async function createAccount(page: Page, timeout = 10000) {
  // Récupération des données Faker
  const {
    email,
    prenom,
    nom,
    address,
    city,
    state,
    zipCode,
    phone,
    motDePasse,
  } = fakerData;

  await page.waitForSelector('[data-qa="login-email"]', {
    state: "visible",
    timeout: 10000,
  });

  //await expect(page.locator('[data-qa="login-email"]')).toBeVisible();

  await page.fill('[data-qa="signup-name"]', nom);
  await page.fill('[data-qa="signup-email"]', email);

  await page.click('[data-qa="signup-button"]');

  await expect(page.getByText("Enter Account Information")).toBeVisible({
    timeout: 10000,
  });

  // -------------------------------
  // 🔹 Étape 1 : Remplir le formulaire de création de compte
  // -------------------------------
  await page.click("#id_gender2");
  await page.fill("#password", motDePasse);
  await page.click("#newsletter");
  await page.click("#optin");
  await page.fill('[data-qa="first_name"]', prenom);
  await page.fill('[data-qa="last_name"]', nom);
  await page.fill('[data-qa="address"]', address);
  await page.selectOption('[data-qa="country"]', { label: "United States" });
  await page.fill('[data-qa="state"]', state);
  await page.fill('[data-qa="city"]', city);
  await page.fill('[data-qa="zipcode"]', zipCode);
  await page.fill('[data-qa="mobile_number"]', phone);
  await page.click('[data-qa="create-account"]');

  // -------------------------------
  // 🔹 Étape 2 : Vérification création du compte
  // -------------------------------
  const message = page.locator('[data-qa="account-created"]');
  await expect(message).toBeVisible({ timeout });
  await expect(message).toHaveText(/Account Created!/i);

  // -------------------------------
  // 🔹 Étape 3 : Continuer vers la Home
  // -------------------------------
  await page.click('[data-qa="continue-button"]');

  // -------------------------------
  // 🔹 Étape 4 : Vérifier connexion réussie
  // -------------------------------
  await expect(page.locator(`li:has-text("Logged in as ${nom}")`)).toBeVisible({
    timeout,
  });

  // -------------------------------
  // 🔹 Retourner les infos Faker (si besoin)
  // -------------------------------
  return {
    prenom,
    nom,
    address,
    city,
    state,
    zipCode,
    phone,
    motDePasse,
  };
}
