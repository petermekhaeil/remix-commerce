import { test, expect } from '@playwright/test';

test.describe('cart', () => {
  test('Should add to cart', async ({ page }) => {
    await page.goto('http://localhost:8787');

    await page.getByTestId('product-card').nth(1).click();

    await expect(page).toHaveURL(/.*product/);

    await page.getByText('Add to cart').click();

    const cartCount = page.getByTestId('cart-count');
    await expect(cartCount).toContainText('1');

    await page.getByTestId('cart-link').click();

    await expect(page).toHaveURL(/.*cart/);

    await expect(page.getByTestId('cart-item')).toHaveCount(1);
  });

  test('Should remove item from cart', async ({ page }) => {
    await page.goto('http://localhost:8787');

    await page.getByTestId('product-card').nth(1).click();

    await page.getByText('Add to cart').click();

    const cartCount = page.getByTestId('cart-count');
    await expect(cartCount).toContainText('1');

    await page.getByTestId('cart-link').click();

    await page.getByText('Remove').click();

    await expect(page.getByTestId('cart-item')).toHaveCount(0);
  });
});
