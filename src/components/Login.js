import React from 'react';
import { authenticateUser } from '../api';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
    this.validate = this.validate.bind(this);
  }

  sendLogin(user, password) {
    console.log(user, password);
    authenticateUser(user, password);
  }

  validate(e) {
    const user = this.usernameInput.current.value;
    const password = this.passwordInput.current.value;
    this.sendLogin(user, password);
  }

  render() {
    return <div>
      <div>
        <input type="text" name="username" ref={this.usernameInput}></input>
      </div>
      <div>
        <input type="password" name="password" ref={this.passwordInput}></input>
      </div>
      <button onClick={this.validate}>Login</button>
    </div>
  }
}
