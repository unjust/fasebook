import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { validateUserToken } from '../api/auth.js';

export default function ProtectedRoute({
  component: Component,
  render: componentRender,
  ...rest}) {
  const isLoggedIn = validateUserToken();
  return (
    <Route 
      {...rest}
      render={(props) => isLoggedIn ? 
        ((Component) ? <Component {...props} /> : componentRender() )
        : <Redirect to="/login" /> }
    />
  );
}
