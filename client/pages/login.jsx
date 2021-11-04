import React from 'react';
import AppContext from '../lib/app-context';
import Redirect from '../lib/redirect';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
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
      .then(res => res.json())
      .then(result => {
        this.props.onSignIn(result);
        window.location.hash = 'home';
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });

  }

  render() {

    const { user } = this.context;
    if (user) {
      return <Redirect to="#home"/>;
    }
    return (
      <div className="login-signup">
        <h1>Login</h1>
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
        <a href="#signup">Don&apos;t have an account? Sign-up here!</a>
      </div>
    );
  }

}

Login.contextType = AppContext;
