import { test, expect } from "@playwright/test";
import userData from "../data/users.json";
import fs from "fs";
import path from "path";

test.describe("TC06 Logout User @contact", () => {
  test("Test Case 6: Contact Us Form JDD JSON @smoke", async ({
    page,
  }, testInfo) => {
    const u3 = userData.newUser3;

    // 1️⃣ Accès HP
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

    const homeLink = page.locator('a[href="/"]', { hasText: "Home" });
    await expect(homeLink).toBeVisible({ timeout: 10000 });

    // 2️⃣ Aller Contact
    await page.locator('a[href="/contact_us"]').click();
    const contactTitle = page.locator("h2.title.text-center", {
      hasText: "Contact Us",
    });
    await expect(contactTitle).toBeVisible();

    // 3️⃣ Formulaire
    await page.fill('[data-qa="name"]', u3.firstName);
    await page.fill('[data-qa="email"]', u3.email);
    await page.fill('[data-qa="subject"]', u3.objet);
    await page.fill('[data-qa="message"]', u3.message);

    // 4️⃣ Générer un fichier temporaire et l’uploader (portable CI/local)
    const tmpFile = path.join(testInfo.outputDir, "contact-upload.txt");
    await fs.promises.writeFile(
      tmpFile,
      "Hello from Playwright (CI safe)\nLine 2"
    );
    await page.setInputFiles('input[type="file"]', tmpFile);

    // 5️⃣ Gérer l’alerte avant Submit
    page.once("dialog", async (d) => {
      console.log("[Dialog]", d.type(), d.message());
      await d.accept();
    });

    // 6️⃣ Submit (sans attendre nav)
    await page
      .locator('[data-qa="submit-button"]')
      .click({ noWaitAfter: true });

    // 7️⃣ Succès
    const success = page.locator(".status.alert.alert-success");
    await expect(success).toBeVisible({ timeout: 15000 });
    await expect(success).toHaveText(
      "Success! Your details have been submitted successfully."
    );

    // 8️⃣ Retour Home
    const homeButton = page.locator("#form-section a.btn.btn-success", {
      hasText: "Home",
    });
    await expect(homeButton).toBeVisible({ timeout: 10000 });
    await homeButton.click();

    await expect(page).toHaveURL("https://automationexercise.com/");
    await expect(homeLink).toBeVisible({ timeout: 10000 });

    console.log(`✅ Test OK:`);
  });
});
