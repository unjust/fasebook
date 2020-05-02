import React from 'react';
import { Redirect } from 'react-router-dom';
import { authenticateUser, validateUserToken } from '../auth';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
    this.validate = this.validate.bind(this);
    const shouldRedirect = validateUserToken();
    this.state = { shouldRedirect };
  }

  async sendLogin(user, password) {
    await authenticateUser(user, password);
    const shouldRedirect = validateUserToken();
    this.setState({ shouldRedirect });
  }

  validate(e) {
    const user = this.usernameInput.current.value;
    const password = this.passwordInput.current.value;
    this.sendLogin(user, password);
  }

  render() {
    const shouldRedirect = this.state.shouldRedirect;
    return (
      <div>
        { shouldRedirect ? (<Redirect to="/home" />) :
          (<div>
            <div>
              <input type="text" name="username" ref={this.usernameInput}></input>
            </div>
            <div>
              <input type="password" name="password" ref={this.passwordInput}></input>
            </div>
            <button onClick={this.validate}>Login</button>
          </div>)
        }
      </div>
    )
  }
}
