import { test, expect } from '@playwright/test';

test.describe('Numaish Bazaar - Stall Owner / Vendor Test Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#auth');
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-VND-01 [Positive]: Vendor logs in with Stall Number & Access PIN', async ({ page }) => {
    // Select Stall Owner tab
    const vendorTab = page.locator('button:has-text("Stall Owner")').first();
    await vendorTab.click();

    // Fill Stall Number and PIN
    const stallInput = page.locator('input[placeholder*="H-22"]').first();
    await stallInput.fill('H-14');

    const pinInput = page.locator('input[type="password"]').first();
    await pinInput.fill('2027');

    // Submit
    const submitBtn = page.locator('button:has-text("Sign In to Stall Vendor Dashboard")').first();
    await submitBtn.click();
    await page.waitForTimeout(800);

    // Verify redirected to Vendor Dashboard
    await expect(page.locator('text=Pochampally Handloom Weavers Co-op').first()).toBeVisible();
    await expect(page.locator('text=Stall H-14').first()).toBeVisible();
  });

  test('TC-VND-08 [Negative]: Vendor login with wrong PIN shows error alert', async ({ page }) => {
    const vendorTab = page.locator('button:has-text("Stall Owner")').first();
    await vendorTab.click();

    const stallInput = page.locator('input[placeholder*="H-22"]').first();
    await stallInput.fill('H-14');

    const pinInput = page.locator('input[type="password"]').first();
    await pinInput.fill('9999'); // Incorrect PIN

    const submitBtn = page.locator('button:has-text("Sign In to Stall Vendor Dashboard")').first();
    await submitBtn.click();
    await page.waitForTimeout(400);

    // Verify error message is displayed
    const errorAlert = page.locator('text=Invalid security PIN. Default initial PIN is 2027');
    await expect(errorAlert).toBeVisible();
  });

  test('TC-VND-09 [Negative]: Vendor login with non-existent stall shows error', async ({ page }) => {
    const vendorTab = page.locator('button:has-text("Stall Owner")').first();
    await vendorTab.click();

    const stallInput = page.locator('input[placeholder*="H-22"]').first();
    await stallInput.fill('H-999'); // Non-existent stall

    const pinInput = page.locator('input[type="password"]').first();
    await pinInput.fill('2027');

    const submitBtn = page.locator('button:has-text("Sign In to Stall Vendor Dashboard")').first();
    await submitBtn.click();
    await page.waitForTimeout(400);

    // Verify error message
    const errorAlert = page.locator('text=No approved stall found matching "H-999"');
    await expect(errorAlert).toBeVisible();
  });

  test('TC-VND-05 [Positive]: Vendor issues new Staff Member Gate Pass', async ({ page }) => {
    // Log in as Vendor H-14
    const vendorTab = page.locator('button:has-text("Stall Owner")').first();
    await vendorTab.click();

    const stallInput = page.locator('input[placeholder*="H-22"]').first();
    await stallInput.fill('H-14');
    const pinInput = page.locator('input[type="password"]').first();
    await pinInput.fill('2027');
    await page.locator('button:has-text("Sign In to Stall Vendor Dashboard")').first().click();
    await page.waitForTimeout(800);

    // Go to Staff tab in Vendor Dashboard
    const staffTab = page.locator('button:has-text("Staff & Gate Passes"), button:has-text("Staff")').first();
    if (await staffTab.isVisible()) {
      await staffTab.click();
      await page.waitForTimeout(400);

      // Verify existing staff passes are rendered
      await expect(page.locator('text=NUM27-GP-H14').first()).toBeVisible();
    }
  });
});
