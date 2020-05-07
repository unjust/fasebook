import React from 'react';
import { Redirect } from 'react-router-dom';
import { authenticateUser, validateUserToken } from '../api/auth';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
    this.validate = this.validate.bind(this);
    const shouldRedirect = validateUserToken();
    this.state = {
      shouldRedirect,
      errors: {}
    };
  }

  sendLogin(user, password) {
    authenticateUser(user, password).then((resp) => {
      const isValid = validateUserToken();
      this.setState({ shouldRedirect: isValid });
      if (!isValid) {
        this.setState({ errors: { auth: resp } });
      }
    });
  }

  validate() {
    const user = this.usernameInput.current.value;
    const password = this.passwordInput.current.value;

    const errors = {};

    if (user.trim() === '') {
      errors.username = 'El campo de usuario no puede estar en blanco';
    }
    if (password.trim() === '') {
      errors.password = 'El campo de clave no puede estar en blanco';
    }
    if (Object.keys(errors).length) {
      this.setState({ errors });
    } else {
      this.setState({ errors });
      this.sendLogin(user, password);
    }
  }

  render() {
    const { shouldRedirect } = this.state;
    return (
      <div>
        { shouldRedirect ? (<Redirect to="/home" />) :
          (<div className='card'>
            <h1>Fasebook</h1>
            <div className='margin--vert' >
              <label htmlFor="username">Usario</label>
              <input type="text" name="username" ref={this.usernameInput}></input>
              { this.state.errors.username
                && <div className="text--error">{ this.state.errors.username }</div>
              }
            </div>
            <div className='margin--vert' >
              <label htmlFor="password">Clave</label>
              <input type="password" name="password" ref={this.passwordInput}></input>
              { this.state.errors.password
                && <div className="text--error">{ this.state.errors.password }</div>
              }
            </div>
            { this.state.errors.auth
              && <div className="text--error">{ this.state.errors.auth }</div>
            }

            <button className="button" onClick={this.validate}>Login</button>
          </div>)
        }
      </div>
    );
  }
}
