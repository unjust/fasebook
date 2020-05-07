/* eslint-disable react/prop-types */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { validateUserToken } from '../api/auth';

export default function ProtectedRoute({
  component: Component,
  render: componentRender,
  ...rest
}) {
  const isLoggedIn = validateUserToken();
  return (
    <Route
      {...rest}
      render={(props) => isLoggedIn ?
        ((Component) ? <Component {...props} /> : componentRender())
        : <Redirect to="/login" /> }
    />
  );
}
