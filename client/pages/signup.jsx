import React from 'react';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.submit = this.submit.bind(this);
  }

  submit(e) {
    e.preventDefault();
    const form = document.forms[0];
    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      password: form.password.value,
      goalWeight: 0
    };
    fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => console.log(data));
  }

  render() {
    return (
      <div className="sign-up">
        <h1>Sign-Up</h1>
        <form action="" method="post">
          <div className="sign-up-form-input">
            <label htmlFor='firstName'>
              First Name

              <input type="text" name="firstName" id="firstName" required></input>
            </label>
            <label htmlFor='lastName'>
              Last Name
              <input type="text" name="lastName" id="lastName" required></input>
            </label>
            <label htmlFor='email'>
              Email
              <input type="email" name="email" id="email" required></input>
            </label>
            <label htmlFor='password'>
              Password
              <input type="password" name="password" id="password" required></input>
            </label>
          </div>
          <div>
            <button id="submit" onClick={this.submit} type="submit" value="Sign-Up">Sign-Up</button>
          </div>

        </form>
        <a href="#login">Switch to login</a>
      </div>
    );
  }
}
