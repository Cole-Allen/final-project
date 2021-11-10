import React from 'react';
import AppContext from '../lib/app-context';
import Redirect from '../lib/redirect';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      passError: '',
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };

    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  submit(e) {
    e.preventDefault();
    const data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    };

    for (const i in data) {
      if (!data[i]) {
        this.setState({
          error: 'All fields must be filled in'
        });
        return;
      }
    }
    if (data.password.length < 8) {
      return;
    }
    fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 400) {
            this.setState({
              error: 'All fields must be filled in'
            });
          } else if (res.status === 500) {
            this.setState({
              error: 'Email is already in use'
            });
          }
        } else {
          window.location.hash = 'login';
        }
        return res.json();
      });
  }

  handleChange(e) {
    const target = e.target.name;
    this.setState({ [target]: e.target.value });
    if (e.target.name === 'password' && e.target.value === '') {
      this.setState((state, props) => ({
        passError: <span className="error">Password is required.</span>
      }));
    } else if (e.target.name === 'password' && e.target.value.length < 8) {
      this.setState((state, props) => ({
        passError: <span className="error">Password is too short.</span>
      }));
    } else {
      this.setState({
        passError: null
      });
    }
  }

  render() {
    const { user } = this.context;

    if (user) {
      return <Redirect to="#home" />;
    }

    return (
      <div className="login-signup">
        <h1>Sign-Up</h1>
        <div>
          {this.state.error}
        </div>
        <form action="" method="post">
          <div className="auth-form-inputs">
            <div className="name-inputs">
              <label
                htmlFor='firstName'
                className="first-name-label auth-label">
                First Name

                <input
                  className="auth-input"
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={this.state.firstName}
                  required
                  onChange={this.handleChange}></input>
              </label>
              <label
                htmlFor='lastName'
                className="last-name-label auth-label">
                Last Name
                <input
                  className="auth-input"
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={this.state.lastName}
                  required
                  onChange={this.handleChange}></input>
              </label>
            </div>

            <label
            htmlFor='email'
            className="email-label auth-label">
              Email
              <input
              className="auth-input"
              type="email"
              name="email"
              id="email"
              value={this.state.email}
              required
              onChange={this.handleChange}></input>
            </label>
            <label
            htmlFor='password'
            className="password-label auth-label">
              Password
              <input
              className="auth-input"
              type="password"
              name="password"
              id="password"
              value={this.state.password}
              required
              onChange={this.handleChange}></input>
            </label>
            {this.state.passError}
          </div>
          <div>
            <button
            id="submit"
            className="auth-submit"
            onClick={this.submit}
            type="submit"
            value="Sign-Up">Sign-Up</button>
          </div>

        </form>
        <a href="#login">Switch to login</a>
      </div>
    );
  }
}

SignUp.contextType = AppContext;
