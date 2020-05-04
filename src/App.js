import React from 'react';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute 
          path="/home" 
          render={(props) =>
            <ProfilePage {...props} isOwner userId={sessionStorage.getItem('userId')} />
          }
        />
        <Route path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
