import React from 'react';
import AppContext from '../lib/app-context';
import decodeToken from '../lib/decode-token';
import Redirect from '../lib/redirect';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (!this.context.user) {
      return <Redirect to="#login"/>;
    }
    const token = decodeToken(window.localStorage.getItem('jwt'));

    return (
      <div>
        <h1>Home</h1>
        <div>Hello, {token.firstName}</div>
        <a href="#login" onClick={this.props.onSignOut}>Log Out</a>
      </div>
    );
  }

}

Home.contextType = AppContext;
