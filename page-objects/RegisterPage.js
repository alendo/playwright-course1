import { v4 as uuidv4 } from "uuid";

export class RegisterPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.getByPlaceholder("E-Mail");
    this.passwordInput = page.getByPlaceholder("Password");
    this.registerButton = page.getByRole("button", { name: "Register" });
  }

  signUpAsNewUser = async (email, password) => {
    // type into email input
    await this.emailInput.waitFor();
    //create new email ID and pass into input
    await this.emailInput.fill(email);

    await this.passwordInput.waitFor();
    // type into password input
    await this.passwordInput.fill(password);
    // click register button
    await this.registerButton.waitFor();
    await this.registerButton.click();

    //assert that you landed on the next page
    // await this.page.waitForURL()
  };
}
