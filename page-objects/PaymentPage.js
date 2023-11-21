import { expect } from '@playwright/test';

export class PaymentPage {
  constructor(page) {
    this.page = page;

    this.discountCode = page
      .frameLocator('[data-qa="active-discount-container"]')
      .locator('[data-qa="discount-code"]');

    // new element for the discount input
    this.discountInputfield = page.locator('[data-qa="discount-code-input"]');

    this.submitDiscountButton = page.locator(
      '[data-qa="submit-discount-button"]'
    );

    this.discountMessage = page.locator('[data-qa="discount-active-message"]');

    this.totalValue = page.locator('[data-qa="total-value"]');
    this.totalWithDiscount = page.locator(
      '[data-qa="total-with-discount-value"]'
    );

    //below are properties for paymentdetails
    this.creditCardOwnerInput = page.locator('[data-qa="credit-card-owner"]');
    this.creditCardNumberInput = page.locator('[data-qa="credit-card-number"]');
    this.validDateInput = page.locator('[data-qa="valid-until"]');
    this.creditCardCVC = page.locator('[data-qa="credit-card-cvc"]');
    this.payButton = page.locator('[data-qa="pay-button"]');
  }

  activateDiscount = async () => {
    await this.discountCode.waitFor();
    const code = await this.discountCode.innerText(); //gets the string inside the discount code locator

    //need to fill out the discount input
    await this.discountInputfield.waitFor();

    // Option 1 for laggy inputs: using .fill() and await expect()
    await this.discountInputfield.fill(code);
    //assert that the text is already there in the input
    await expect(this.discountInputfield).toHaveValue(code);

    //Option 2 for laggy inputs: slow typing
    // focus the typing on a specific input field
    // await this.discountInputfield.focus();
    // then type the text in the focused field. Slow type by adding delay
    // await this.page.keyboard.type(code, { delay: 1000 });
    // expect(await this.discountInputfield.inputValue()).toBe(code);

    // check the the "Discount Activated" is not present before the click
    expect(await this.discountMessage.isVisible()).toBe(false);

    await this.submitDiscountButton.waitFor();
    await this.submitDiscountButton.click();
    //  check that it displays "discount activated" - no need to validate the innertext - the property/locator is enough
    await this.discountMessage.waitFor();

    // check that there is now a discounted price total showing
    await this.totalWithDiscount.waitFor();
    const discountedPriceText = await this.totalWithDiscount.innerText();
    const discountedPriceOnlyStringNumber = discountedPriceText.replace(
      '$',
      ''
    ); //still a string

    const discountedPriceValue = parseInt(discountedPriceOnlyStringNumber, 10); //return a string as Number

    // check that the discounted price total is smaller than reguar one
    await this.totalValue.waitFor();
    const totalValueText = await this.totalValue.innerText();
    const totalValueTextStringNumber = totalValueText.replace('$', '');
    const totalValueNumber = parseInt(totalValueTextStringNumber, 10);
    expect(discountedPriceValue).toBeLessThan(totalValueNumber);
  };

  fillPaymentDetails = async (paymentDetails) => {
    await this.creditCardOwnerInput.waitFor();
    // note: paymentDetails.cardOwner calls on the object's (paymentDetails) property which is
    await this.creditCardOwnerInput.fill(paymentDetails.cardOwner);

    await this.creditCardNumberInput.waitFor();
    await this.creditCardNumberInput.fill(paymentDetails.cardNumber);

    await this.validDateInput.waitFor();
    await this.validDateInput.fill(paymentDetails.validDate);

    await this.creditCardCVC.waitFor();
    await this.creditCardCVC.fill(paymentDetails.cardCVC);
  };

  completePayment = async () => {
    await this.payButton.waitFor();
    await this.payButton.click();
    // below is a regex url
    await this.page.waitForURL(/\/thank-you/, { timeout: 3000 });
  };
}
