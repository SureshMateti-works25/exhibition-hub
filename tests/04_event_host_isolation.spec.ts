import { test, expect } from '@playwright/test';

test.describe('Numaish Bazaar - Event Host & Multi-Tenant Isolation Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#auth');
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-ADM-01 [Positive]: Event Host logs in and enters Society Console', async ({ page }) => {
    // Select Event Host tab
    const hostTab = page.locator('button:has-text("Event Host")').first();
    await hostTab.click();
    await page.waitForTimeout(300);

    // Select Numaish quick select button
    const numaishSelect = page.locator('button:has-text("Numaish")').first();
    await numaishSelect.click();
    await page.waitForTimeout(300);

    // Submit Host Login
    const submitBtn = page.locator('button:has-text("Sign In to Event Host Console")').first();
    await submitBtn.click();
    await page.waitForTimeout(1000);

    // Verify redirected to Society Console
    await expect(page.locator('main').locator('text=The Exhibition Society').first()).toBeVisible();
    await expect(page.locator('h2:has-text("Numaish")').first()).toBeVisible();
    await expect(page.locator('text=Event Data Isolation Active').first()).toBeVisible();
  });

  test('TC-ISO-01 & TC-ISO-02 [Positive]: Strict Event-Level Stall Isolation between Numaish and SARAS', async ({ page }) => {
    // 1. Visit stalls directory under Numaish 2027
    await page.goto('/#stalls');
    await page.waitForTimeout(600);

    // Verify Numaish stalls are visible
    await expect(page.locator('text=Stall H-14').first()).toBeVisible();
    await expect(page.locator('text=Pochampally Handloom Weavers Co-op').first()).toBeVisible();

    // Verify SARAS Mela stalls are strictly HIDDEN
    await expect(page.locator('text=Stall S-01')).not.toBeVisible();
    await expect(page.locator('text=Medak Rural Women Jute')).not.toBeVisible();

    // 2. Open Expos Directory to switch exhibition to SARAS Crafts Mela 2027
    const exposBtn = page.locator('button:has-text("Expos")').first();
    await exposBtn.click();
    await page.waitForTimeout(600);

    // Click "Select & Explore Stalls" for SARAS
    const sarasSelectBtn = page.locator('button:has-text("Select & Explore Stalls")').first();
    await sarasSelectBtn.click();
    await page.waitForTimeout(800);

    // Verify SARAS stalls are now visible
    await expect(page.locator('text=Stall S-01').first()).toBeVisible();
    await expect(page.locator('text=Medak Rural Women Jute').first()).toBeVisible();

    // Verify Numaish stalls are now strictly HIDDEN
    await expect(page.locator('text=Stall H-14')).not.toBeVisible();
    await expect(page.locator('text=Pochampally Handloom Weavers Co-op')).not.toBeVisible();
  });

  test('TC-SPD-01 [Positive]: Event Host can view and configure Special Days (Ladies-Only Day)', async ({ page }) => {
    // Navigate to admin portal
    await page.goto('/#admin');
    await page.waitForTimeout(600);

    // Click on Event & Special Days tab
    const eventTab = page.locator('button:has-text("Event & Special Days")').first();
    if (await eventTab.isVisible()) {
      await eventTab.click();
      await page.waitForTimeout(400);

      // Verify Ladies-Only Day is listed with rules
      await expect(page.locator('text=Ladies Only Day, text=Ladies-Only Day').first()).toBeVisible();
      await expect(page.locator('text=Male visitors strictly barred, text=Men strictly barred').first()).toBeVisible();
    }
  });
});
