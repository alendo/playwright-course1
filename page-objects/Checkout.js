import { expect } from "@playwright/test"; //assertion

export class Checkout {
  constructor(page) {
    this.page = page;

    this.basketCards = page.locator('[data-qa="basket-card"]');
    this.basketItemPrice = page.locator('[data-qa="basket-item-price"]');
    this.basketItemRemoveButton = page.locator(
      '[data-qa="basket-card-remove-item"]'
    );
    this.continueToCheckoutButton = page.locator(
      '[data-qa="continue-to-checkout"]'
    );
  }

  removeCheapestProduct = async () => {
    await this.basketCards.first().waitFor();
    const itemsBeforeRemoval = await this.basketCards.count();

    await this.basketItemPrice.first().waitFor();
    const allPriceText = await this.basketItemPrice.allInnerTexts();
    // allPriceText: [ '499$', '599$', '320$' ]  --> convert from string to numbers
    const justNumbers = allPriceText.map((element) => {
      const withoutDollarSign = element.replace("$", ""); //499$ -> 499
      return parseInt(withoutDollarSign, 10);
    });
    const smallestPrice = Math.min(...justNumbers);
    const smallestPriceIdx = justNumbers.indexOf(smallestPrice);
    const specificRemoveButton = await this.basketItemRemoveButton.nth(
      smallestPriceIdx
    );
    await specificRemoveButton.waitFor();
    await specificRemoveButton.click();
    await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1);
  };

  continueToCheckout = async () => {
    await this.continueToCheckoutButton.waitFor(); //as always wait for element (button) to exist
    await this.continueToCheckoutButton.click(); //clicks the button now that it shows up
    await this.page.waitForURL(/\/login/, { timeout: 3000 }); //timeout object in javascript
  };
}
