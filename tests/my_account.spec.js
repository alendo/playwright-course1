import { test } from '@playwright/test';
import { MyAccountPage } from '../page-objects/MyAccountPage.js';
import { getLoginToken } from '../api-calls/getLoginToken.js';
import { adminDetails } from '../data/userDetails.js';

test.skip('My Account with cookie injection', async ({ page }) => {
 const loginToken = await getLoginToken(
   adminDetails.username,
   adminDetails.password
 ); // make a request to get login token

 //mocking network request
 await page.route('**/api/user**', async (route, request) => {
   await route.fulfill({
     status: 500,
     contentType: 'application/json',
     body: JSON.stringify({ message: 'Playwright Error for Mocking' }),
   });
 });

 const myAccount = new MyAccountPage(page); // Inject login token to browser
 await myAccount.visit();

 await page.evaluate(
   ([loginTokenInsideBrowserCode]) => {
     document.cookie = 'token=' + loginTokenInsideBrowserCode;
   },
   [loginToken]
 );
 await myAccount.visit();

 await myAccount.waitForPageHeading();
 await myAccount.waitForErrorMessage();
});
