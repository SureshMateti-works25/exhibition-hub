import { test, expect } from '@playwright/test';

test.describe('Numaish Bazaar - Guest / Shopper Test Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Reset to base URL
    await page.goto('/#stalls');
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-GST-01 [Positive]: Guest can browse Numaish stalls directory without login', async ({ page }) => {
    // Verify stalls directory heading is visible
    const stallsHeading = page.locator('text=Exhibitor Pavilions & Stalls').first();
    await expect(stallsHeading).toBeVisible();

    // Verify key Numaish stalls are rendered
    await expect(page.locator('text=Stall H-14').first()).toBeVisible();
    await expect(page.locator('text=Pochampally Handloom Weavers Co-op').first()).toBeVisible();
    await expect(page.locator('text=Stall FD-02').first()).toBeVisible();
  });

  test('TC-GST-02 [Positive]: Filter stalls by category (Handlooms & Weaves)', async ({ page }) => {
    // Click on Handlooms category button
    const handloomsFilter = page.locator('button:has-text("Handlooms & Weaves")').first();
    await handloomsFilter.click();

    // Verify Handlooms stall appears
    await expect(page.locator('text=Stall H-14').first()).toBeVisible();

    // Verify Non-handloom food stall is not visible in the filtered results
    await expect(page.locator('text=Stall FD-02')).not.toBeVisible();
  });

  test('TC-GST-03 [Positive]: Search stalls by stall number (H-14)', async ({ page }) => {
    // Locate the search bar
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('H-14');
    await page.waitForTimeout(400);

    // Verify Stall H-14 is visible
    await expect(page.locator('text=Pochampally Handloom Weavers Co-op').first()).toBeVisible();
    // Non-matching stalls should be filtered out
    await expect(page.locator('text=Stall FD-02')).not.toBeVisible();
  });

  test('TC-GST-04 [Positive]: Open Stall Detail Page and verify DPDP phone masking', async ({ page }) => {
    // Click on Visit Stall Page for Stall H-14
    const visitStallBtn = page.locator('button:has-text("Visit Stall Page")').first();
    await visitStallBtn.click();
    await page.waitForTimeout(500);

    // Verify on stall detail page
    await expect(page.locator('p:has-text("Stall H-14")').first()).toBeVisible();

    // Verify DPDP Phone masking: full phone number must NOT be displayed in plaintext
    const fullUnmaskedPhone = page.locator('text="+91 98480 23145"');
    await expect(fullUnmaskedPhone).not.toBeVisible();

    // Verify masked phone is displayed
    const maskedPhone = page.locator('text=/\\+91 98480 •••••/');
    await expect(maskedPhone.first()).toBeVisible();
  });

  test('TC-GST-07 [Negative]: Search with non-existent stall returns clean zero-state', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('Z-9999');
    await page.waitForTimeout(400);

    // Verify friendly empty state
    await expect(page.locator('text=No exhibition stalls matching your search').first()).toBeVisible();
  });
});

