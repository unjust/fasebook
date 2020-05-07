import React from 'react';
import TestRenderer from 'react-test-renderer';
import { BrowserRouter, Redirect } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ProfilePage from '../components/ProfilePage';
import * as authApi from '../api/auth';

describe('ProtectedRoute component', () => {
  jest.mock('../api/auth');
  const renderMock = jest.fn(() => <div></div>);

  it('renders the component if logged in', () => {
    authApi.validateUserToken = jest.fn(() => true);
    const component = TestRenderer.create(
      <BrowserRouter>
        <ProtectedRoute render={renderMock} component={ProfilePage} />
      </BrowserRouter>
    );
    expect(() => component.root.findByType(ProfilePage)).not.toThrowError();
  });

  it('redirects if not logged in', () => {
    authApi.validateUserToken = jest.fn(() => false);
    const component = TestRenderer.create(
        <BrowserRouter>
          <ProtectedRoute render={renderMock} component={ProfilePage} />
        </BrowserRouter>
    );
    expect(() => component.root.findByType(Redirect)).not.toThrowError();
  });
});
