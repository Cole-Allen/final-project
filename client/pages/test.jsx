import React from 'react';
import { Link } from 'react-router-dom';

export default class Test extends React.Component {
  render() {
    window.location.pathname = 'home';
    return (
      <main>
        <h1>Hello</h1>
        <Link to="/login">Login</Link>
      </main>
    );
  }
}
