import axios from 'axios';
import jwt from 'jsonwebtoken';

const accessTokenSecret = process.env.REACT_APP_TOKEN_SECRET;

export const authenticateUser = function(username, password) {
  // send username and password to db
  // wait for response with jwt or not
  // redirect
  debugger
  axios.post('/api/auth', { username, password})
    .then((resp) => {
      console.log(resp);
      sessionStorage.setItem('fasebookToken', resp.data);
    })
    .catch((e) => {
      console.log(e);
    })
}

export const validateUser = function() {
  const t = sessionStorage.getItem('fasebookToken');
  try {
    jwt.verify(t, accessTokenSecret);
    return true;
  } catch(err) {
    console.log('error validating token', err);
    return false;
  }
}
