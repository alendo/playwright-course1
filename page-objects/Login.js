import { expect } from "@playwright/test";
import { Navigation } from "./Navigation";

export class Login {
  constructor(page) {
    this.page = page;

    this.registerButton = page.locator('[data-qa="go-to-signup-button"]');
  }

  //method below for going to Register page from Login page
  continueToRegister = async () => {
    // makes sure retister button exists
    await this.registerButton.waitFor();
    // click on register button
    await this.registerButton.click();

    // assert that the url is register/signup
    await this.page.waitForURL(/\/signup/, { timeout: 3000 });
  };
}
