import axios from 'axios';
import jwt from 'jsonwebtoken';

export const accessTokenSecret = process.env.REACT_APP_TOKEN_SECRET;
export const tokenSessionStorageKey = 'fasebookToken';

export const getAuthToken = () => sessionStorage.getItem(tokenSessionStorageKey);

// organized this way for testing purposes
export const authData = {
  store: (userId, accessToken) => {
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem(tokenSessionStorageKey, accessToken); 
    console.log(sessionStorage.getItem(tokenSessionStorageKey));  
  }
};

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

export const authenticateUser = (username, password) =>
  axios.post('/api/auth', { username, password })
    .then((resp) => {
      // TODO move this to catch?
      if (resp.data && resp.data.error) {
        return 'Usario o clave estan incorrectos';
      }
      const { userId, accessToken } = resp.data;
      authData.store(userId, accessToken);
      // TODO need to figure out responses for unsuccessful logins
      return;
    })
    .catch((e) => {
      console.log(e);
    })



