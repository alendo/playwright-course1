import * as nodeFetch from 'node-fetch';

// here we put in a function that we want to export
// this is a login token function that makes a network requests
// that supplies the api with username and password
export const getLoginToken = async (username, password) => {
  const response = await nodeFetch('http://localhost:2221/api/login', {
    method: 'POST',
    body: JSON.stringify({ username: username, password: password }),
  });
  if (response.status !== 200) {
    throw new Error('An error occured trying to retrieve the login token.');
  }
  const body = await response.json();
  return body.token;
};
