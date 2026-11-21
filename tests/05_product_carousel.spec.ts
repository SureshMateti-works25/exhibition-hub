import { test, expect } from '@playwright/test';

test.describe('Numaish Bazaar - Product Multi-Angle Carousel Scenarios', () => {
  test('TC-IMG-01 [Desktop]: Product renders left thumbnails and large hero image', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    // Navigate directly to product page
    await page.goto('/#product/prod-1');
    await page.waitForTimeout(800);

    // Verify product title and price
    await expect(page.locator('text=Authentic Pochampally Pure Silk Double Ikat Saree').first()).toBeVisible();
    await expect(page.locator('text=₹').first()).toBeVisible();

    // Verify thumbnail buttons are visible on desktop (left strip)
    const thumbnails = page.locator('button[title*="Angle"], img[alt*="Angle"], img[alt*="Drape"], img[alt*="Zari"], img[alt*="Blouse"]');
    const count = await thumbnails.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Click a thumbnail to switch image
    const secondThumb = page.locator('button[title*="Angle #2"]').first();
    if (await secondThumb.isVisible()) {
      await secondThumb.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-IMG-02 & TC-IMG-03 [Mobile]: Hero carousel with Prev/Next buttons (no vertical stacking)', async ({ page }) => {
    // Set to iPhone viewport
    await page.setViewportSize({ width: 390, height: 844 });
    // Navigate directly to product page
    await page.goto('/#product/prod-1');
    await page.waitForTimeout(800);

    // Verify product title is visible in h1
    await expect(page.locator('h1:has-text("Pochampally")').first()).toBeVisible();

    // Verify Left vertical thumbnail strip is hidden on mobile
    const desktopThumbnailStrip = page.locator('.sm\\:flex.flex-col.sm\\:w-24');
    await expect(desktopThumbnailStrip).not.toBeVisible();

    // Check for carousel overlay navigation buttons (Prev / Next)
    const nextBtn = page.locator('button[aria-label*="Next"], button:has-text("Next Image Angle")').first();
    const prevBtn = page.locator('button[aria-label*="Previous"], button:has-text("Previous Image Angle")').first();

    await expect(nextBtn).toBeVisible();
    await expect(prevBtn).toBeVisible();

    // Click next image
    await nextBtn.click();
    await page.waitForTimeout(300);

    // Click prev image
    await prevBtn.click();
    await page.waitForTimeout(300);

    // Verify Color and Size variation selectors are displayed below the carousel
    await expect(page.locator('text=Available Colors').first()).toBeVisible();
    await expect(page.locator('text=Available Sizes').first()).toBeVisible();
  });
});

