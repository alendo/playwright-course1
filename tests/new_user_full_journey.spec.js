import { test } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { ProductsPage } from '../page-objects/ProductsPage.js';
import { Navigation } from '../page-objects/Navigation.js';
import { Checkout } from '../page-objects/Checkout.js';
import { Login } from '../page-objects/Login.js';
import { RegisterPage } from '../page-objects/RegisterPage.js';
import { DeliveryDetails } from '../page-objects/DeliveryDetails.js';
import { deliveryDetails as userAddress } from './../data/deliveryDetails.js';
import { PaymentPage } from '../page-objects/PaymentPage.js';
import { paymentDetails } from '../data/paymentDetails';

test('New user full end-to-end journey', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await productsPage.visit();
  await productsPage.sortByCheapest();
  await productsPage.addProductsToBasket(0);
  await productsPage.addProductsToBasket(1);
  await productsPage.addProductsToBasket(2);

  const navigation = new Navigation(page);
  await navigation.goToCheckout();

  const checkout = new Checkout(page); //instantiate Checkout page object
  await checkout.removeCheapestProduct();
  await checkout.continueToCheckout(); // Goes to login page

  // new instance of Login page or else you can't call the method
  const login = new Login(page);
  await login.continueToRegister();

  // instatiate the PageObject of
  const registerPage = new RegisterPage(page);
  const email = uuidv4() + 'gmail';
  const password = uuidv4();
  await registerPage.signUpAsNewUser(email, password); //pass the arguments into the method

  const deliveryDetails = new DeliveryDetails(page);
  await deliveryDetails.fillDetails(userAddress); //this is the method to be done
  await deliveryDetails.saveDetails();
  await deliveryDetails.continueToPayment();

  const paymentPage = new PaymentPage(page);
  await paymentPage.activateDiscount();

  await paymentPage.fillPaymentDetails(paymentDetails); //dummy method that takes in payment Details Object -> in data folder
  await paymentPage.completePayment();
});
