import { test, expect } from '@playwright/test';
// test above is a function that is called from the directory of playwright/test

test.skip('Product Page Add To Basket', async ({ page }) => {
  await page.goto('/'); //slash means basically the main page
  // await page.pause()

  const addToBasketbutton = page.locator('[data-qa="product-button"]').first();
  const basketCounter = page.locator('[data-qa="header-basket-count"]');

  await addToBasketbutton.waitFor();
  await expect(addToBasketbutton).toHaveText('Add to Basket');
  await expect(basketCounter).toHaveText('0');

  await addToBasketbutton.click();

  await expect(addToBasketbutton).toHaveText('Remove from Basket');
  await expect(basketCounter).toHaveText('1');

  const checkoutLink = page.getByRole('link', { name: 'Checkout' });
  await checkoutLink.waitFor();
  await checkoutLink.click();
  // await page.pause()
  await page.waitForURL('/basket');
});
