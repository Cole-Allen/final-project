import React from 'react';
import Login from './pages/login';
import SignUp from './pages/signup';
import Home from './pages/home';
import NotFound from './pages/not-found';
import parseRoute from './lib/parse-route';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {

    window.addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  render() {
    const { route } = this.state;
    if (route.path === 'home') {
      return <Home/>;
    } else if (route.path === 'login') {
      return <Login/>;
    } else if (route.path === 'signup') {
      return <SignUp />;
    }
    return <NotFound/>;
  }
}
