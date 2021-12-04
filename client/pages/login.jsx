import React from 'react';
import AppContext from '../lib/app-context';
import Redirect from '../lib/redirect';
import { Link } from 'react-router-dom';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            this.setState({ error: 'Invalid Email/Login' });
          } else {
            this.setState({ error: 'An unexpected error occurred' });
          }
        }
        return res.json();
      })
      .then(result => {
        this.props.onSignIn(result);
        window.location.pathname = 'home';
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error: ''
    });

  }

  render() {

    const { user } = this.context;
    if (user) {
      window.location.pathname = 'home';
    }
    let err;
    if (this.state.error) {
      err = <div className="error">
        {this.state.error}
      </div>;
    }
    return (
      <div className="login-signup">
        <h1>Login</h1>
        {err}
        <form method="post">
          <label
          className="auth-label"
          htmlFor="email">
            Email
            <input
            className="auth-input"
            id="email"
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            required></input>
          </label>
          <label
          className="auth-label"
          htmlFor="password">
            Password
            <input
              className="auth-input"
            id="password"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            required></input>
          </label>

          <button className="auth-submit" onClick={this.handleSubmit} type="submit">Log In</button>
        </form>

        <Link to="/signup">Don&apos;t have an account? Sign-up here!</Link>
      </div>
    );
  }

}

Login.contextType = AppContext;
