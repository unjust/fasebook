import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { validateUserToken } from '../auth.js';

export default function ProtectedRoute({ component: Component, ...rest}) {
  const isLoggedIn = validateUserToken();
  return (
    <Route 
      {...rest}
      render={(props) => isLoggedIn ? <Component {...props} /> : <Redirect to="/login" /> }
    />
  );
}
