import { test, expect } from "@playwright/test";
import userData from "../data/users.json";
import { Page } from "@playwright/test";

// toujours créer le compte manuellement avant
test.describe("TC06 Logout User @contact", () => {
  test("Test Case 6: Contact Us Form JDD JSON", async ({ page }) => {
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

    // Cliquer sur Contact
    await page.locator('a[href="/contact_us"]').click();

    // Page Contact
    const contactTitle = page.locator("h2.title.text-center", {
      hasText: "Contact Us",
    });
    await expect(contactTitle).toBeVisible();

    // Remplire le formulaire
    await page.fill('[data-qa="name"]', u3.firstName);
    await page.fill('[data-qa="email"]', u3.email);
    await page.fill('[data-qa="subject"]', u3.objet);
    await page.fill('[data-qa="message"]', u3.message);

    // Définir le chemin de ton fichier local
    const cheminFichier =
      "/Users/tafsir/Desktop/dossier sans titre/practice_automation.feature";

    // Remplir le champ de type "file"
    await page.setInputFiles('input[type="file"]', cheminFichier);

    // Préparer l’acceptation AVANT le clic
    page.once("dialog", async (d) => {
      console.log("[Dialog]", d.type(), d.message());
      // Si c’est un confirm/prompt et que tu veux refuser : await d.dismiss();
      await d.accept();
    });

    // Clic sur Submit sans attendre une nav (sinon ça peut bloquer)
    const submit = page.locator('[data-qa="submit-button"]');
    await submit.click({ noWaitAfter: true });

    //Vérifier l'affichage du message de succè
    const success = page.locator(".status.alert.alert-success");
    await expect(success).toBeVisible({ timeout: 15000 });
    await expect(success).toHaveText(
      "Success! Your details have been submitted successfully."
    );

    // Cliquer sur Home
    // Une fois le message visible, cliquer sur "Home"
    const homeButton = page.locator("#form-section a.btn.btn-success", {
      hasText: "Home",
    });
    await expect(homeButton).toBeVisible({ timeout: 10000 });
    await homeButton.click();

    //Vérifier la redirection vers la page d’accueil
    await expect(page).toHaveURL("https://automationexercise.com/");

    //Vérifier le retour sur la HP

    await expect(homeLink).toBeVisible({ timeout: 10000 });

    console.log(`✅ Test OK:`);
  });
});
