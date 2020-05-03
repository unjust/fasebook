import React from 'react';
// import logo from './logo.svg';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute 
          path="/home" 
          render={(props) => <Home {...props} userId={sessionStorage.getItem('userId')} />}
        />
        <Route path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
