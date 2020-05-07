import React from 'react';

import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <ProtectedRoute
          path="/"
          render={(props) =>
            <ProfilePage {...props} isOwner userId={sessionStorage.getItem('userId')} />
          }
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
