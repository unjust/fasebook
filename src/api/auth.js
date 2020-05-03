import axios from 'axios';
import jwt from 'jsonwebtoken';

export const accessTokenSecret = process.env.REACT_APP_TOKEN_SECRET;
export const tokenSessionStorageKey = 'fasebookToken';

export const authenticateUser = (username, password) => {
  // send username and password to db
  // wait for response with jwt or not
  // redirect
  return axios.post('/api/auth', { username, password })
    .then((resp) => {
      if (resp.data && resp.data.error) {
        return false;
      }
      console.log(resp);
      sessionStorage.setItem('userId', resp.data.userId);
      sessionStorage.setItem(tokenSessionStorageKey, resp.data.accessToken);
      // here need to figure out resonses for unsuccessful logins
      return true;
    })
    .catch((e) => {
      console.log(e);
    })
  }

export const getAuthToken = () => sessionStorage.getItem(tokenSessionStorageKey);

export const validateUserToken = function() {
  const t = getAuthToken();
  try {
    jwt.verify(t, accessTokenSecret);
    return true;
  } catch(err) {
    console.log('token not validated', err);
    return false;
  }
}
