import { expect } from '@playwright/test';
import { Navigation } from './Navigation.js';
import { isDesktopViewport } from '../utils/isDesktopViewport.js';

export class ProductsPage {
  constructor(page) {
    //this is a method. No equal sign like a function
    this.page = page; //this = ProductPage class

    this.addButtons = page.locator('[data-qa="product-button"]'); //add properter to the constructor so it's not hard coded
    this.sortDropdown = page.locator('[data-qa="sort-dropdown"]');
    this.productTitle = page.locator('[data-qa="product-title"]');
  }

  visit = async () => {
    // this is an arrow function
    await this.page.goto('http://localhost:2221/');
  };

  addProductsToBasket = async (index) => {
    const specificAddButton = this.addButtons.nth(index);
    await specificAddButton.waitFor(); // nth method with 0 index position
    await expect(specificAddButton).toHaveText('Add to Basket');

    // since the getBasketCount() method is no longer part of this class
    // we must import the class first, which has the method --> import { Navigation } from "./Navigation.js"
    const navigation = new Navigation(this.page); // new const variable that results newly instantiated object of the Page Object Navigation

    // should only run on desktop viewport
    let basketCountBeforeClick; //undefined
    if (isDesktopViewport(this.page)) {
      basketCountBeforeClick = await navigation.getBasketCount();
    }
    await specificAddButton.click();
    await expect(specificAddButton).toHaveText('Remove from Basket');

    // should only run on desktop viewport
    if (isDesktopViewport(this.page)) {
      const basketCountAfterClick = await navigation.getBasketCount();
      expect(basketCountAfterClick).toBeGreaterThan(basketCountBeforeClick);
    }
  };

  sortByCheapest = async () => {
    await this.sortDropdown.waitFor(); //check that element exist
    await this.productTitle.first().waitFor();
    const productTitleBeforeSorting = await this.productTitle.allInnerTexts();
    await this.sortDropdown.selectOption('price-asc');
    const productTitleAfterTesting = await this.productTitle.allInnerTexts();
    expect(productTitleBeforeSorting).not.toEqual(productTitleAfterTesting);
    // await this.page.pause();
  };
}
