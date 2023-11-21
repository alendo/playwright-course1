import { expect } from '@playwright/test';
import { isDesktopViewport } from '../utils/isDesktopViewport.js';

export class Navigation {
  constructor(page) {
    //a constructor that takes page below
    this.page = page; // assign the page property (.page) to class Navigation (this) that is (=) the page that goes into the constructure.

    //Navigation has a property (.page) which is the page ( = page) that we shoot in

    this.basketCounter = page.locator('[data-qa="header-basket-count"]');
    this.checkoutLink = page.getByRole('link', { name: 'Checkout' });

    this.mobileBurgerMenu = page.locator('[data-qa="burger-button"]');
  }

  getBasketCount = async () => {
    await this.basketCounter.waitFor();
    // return number
    const text = await this.basketCounter.innerText();
    // '0' -> 0
    const asNumber = parseInt(text, 10); //return a string as number
    return asNumber;
  };

  // true if desktop
  // false if mobile --> reverse false !false === true
  goToCheckout = async () => {
    //if mobile viewport, first open burger menu
    if (!isDesktopViewport(this.page)) {
      await this.mobileBurgerMenu.waitFor();
      await this.mobileBurgerMenu.click();
    }

    await this.checkoutLink.waitFor(); //remember checkOut link is now a property of the Navigation Page Object so use 'this'
    await this.checkoutLink.click();
    await this.page.waitForURL('/basket');
  };
}
