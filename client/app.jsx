import React from 'react';
import Login from './pages/login';
import SignUp from './pages/signup';
import Home from './pages/home';
import Week from './pages/week';
import Routines from './pages/routines';
import Routine from './pages/routine';
import NotFound from './pages/not-found';
import parseRoute from './lib/parse-route';
import AppContext from './lib/app-context';
import decodeToken from './lib/decode-token';
import Settings from './pages/connect-spotify';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      route: parseRoute(window.location.hash)
    };

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {

    window.addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('jwt');
    this.setState({ user: null });
  }

  renderPage() {

    const { path } = this.state.route;

    switch (path) {
      case 'home':
        return <Home onSignOut={this.handleSignOut} />;
      case 'login':
        return <Login onSignIn={this.handleSignIn} />;
      case 'signup':
        return <SignUp />;
      case 'week':
        return <Week />;
      case 'routines':
        return <Routines/>;
      case 'routine' :
        return <Routine/>;
      case 'settings' :
        return <Settings/>;
      case '' :
        window.location.hash = 'home';
        break;
      default:
        return <NotFound />;
    }
  }

  render() {
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        {this.renderPage()}
      </AppContext.Provider>
    );
  }
}
