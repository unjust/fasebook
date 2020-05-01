import React from 'react';
// import logo from './logo.svg';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './ProtectedRoute';
import { Switch, Route } from 'react-router-dom';
import './App.css';

function App() {
  const App = () => (
    <div>
      <Switch>
        <ProtectedRoute path="/home" component={Home} />
        <Route path="/login" component={Login} />
      </Switch>
    </div>
  )
  return <Switch><App /></Switch>
}

export default App;
