import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { validateUser } from './api.js';
const isLoggedIn = validateUser();

export default function ProtectedRoute({ component: Component, ...rest}) {
  return (
    <Route 
      {...rest}
      render={(props) => isLoggedIn ? <Component {...props} /> : <Redirect to="/login" /> }
    />
  );
}
