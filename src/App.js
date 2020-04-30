import React from 'react';
// import logo from './logo.svg';
import Login from './components/Login';
import Home from './components/Home';
import {Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

function App() {
  const App = () => (<div>
    {false &&
      <Redirect to="/login" />
    } 
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
    </Switch>
  </div>);
  return <Switch><App /></Switch>
}

export default App;
