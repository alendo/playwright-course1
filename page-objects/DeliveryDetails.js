import { expect } from '@playwright/test';

export class DeliveryDetails {
  constructor(page) {
    this.page = page;

    this.firstNameField = page.getByPlaceholder('First name');
    this.lastNameField = page.getByPlaceholder('Last name');
    this.streetField = page.getByPlaceholder('Street');
    this.postcodeField = page.getByPlaceholder('Post code');
    this.cityField = page.getByPlaceholder('City');

    this.countryDropdown = page.locator('[data-qa="country-dropdown"]');

    this.saveAddressButton = page.getByRole('button', {
      name: 'Save address for next time',
    });

    this.savedAddressContainer = page.locator(
      '[data-qa="saved-address-container"]'
    );

    // add properties of the saved address fields
    this.savedAddressFirstName = page.locator(
      '[data-qa="saved-address-firstName"]'
    );
    this.savedAddressLastName = page.locator(
      '[data-qa="saved-address-lastName"]'
    );
    this.savedAddressStreet = page.locator('[data-qa="saved-address-street"]');
    this.savedAddressPostcode = page.locator(
      '[data-qa="saved-address-postcode"]'
    );
    this.savedAddressCity = page.locator('[data-qa="saved-address-city"]');
    this.savedAddressCountry = page.locator(
      '[data-qa="saved-address-country"]'
    );

    this.continueToPaymentButton = page.locator(
      '[data-qa="continue-to-payment-button"]'
    );
  }

  fillDetails = async (userAddress) => {
    await this.firstNameField.waitFor();
    await this.firstNameField.fill(userAddress.firstName);

    await this.lastNameField.waitFor();
    await this.lastNameField.fill(userAddress.lastName);

    await this.streetField.waitFor();
    await this.streetField.fill(userAddress.street);

    await this.postcodeField.waitFor();
    await this.postcodeField.fill(userAddress.postcode);

    await this.cityField.waitFor();
    await this.cityField.fill(userAddress.city);

    await this.countryDropdown.waitFor();
    await this.countryDropdown.selectOption(userAddress.country);
  };

  saveDetails = async () => {
    const addressCountBeforeSaving = await this.savedAddressContainer.count();
    await this.saveAddressButton.waitFor();
    await this.saveAddressButton.click();

    await this.savedAddressContainer.waitFor();

    //assertion below: container count increased by 1??
    // notice the expect function
    await expect(this.savedAddressContainer).toHaveCount(
      addressCountBeforeSaving + 1
    );

    await this.savedAddressFirstName.first().waitFor();
    //Assertions: no need to use await at the beginning of expect below
    expect(await this.savedAddressFirstName.first().innerText()).toBe(
      await this.firstNameField.inputValue()
    );

    await this.savedAddressLastName.first().waitFor();
    expect(await this.savedAddressLastName.first().innerText()).toBe(
      await this.lastNameField.inputValue()
    );

    await this.savedAddressCity.first().waitFor();
    expect(await this.savedAddressCity.first().innerText()).toBe(
      await this.cityField.inputValue()
    );

    await this.savedAddressPostcode.first().waitFor();
    expect(await this.savedAddressPostcode.first().innerText()).toBe(
      await this.postcodeField.inputValue()
    );

    await this.savedAddressCountry.first().waitFor();
    expect(await this.savedAddressCountry.first().innerText()).toBe(
      await this.countryDropdown.inputValue()
    );
  };

  continueToPayment = async () => {
    await this.continueToPaymentButton.waitFor();
    await this.continueToPaymentButton.click();
    await this.page.waitForURL(/\/payment/, { timeout: 3000 });
  };
}
