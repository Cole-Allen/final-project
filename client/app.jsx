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
import Test from './pages/test';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

  render() {
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Test/>} />
            <Route path="/login" element={<Login onSignIn={this.handleSignIn}/>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path='/home' element={<Home onSignOut={this.handleSignOut}/>} />
            <Route path='/settings' element={<Settings/>} />
            <Route path="/*"
            element = {
              <h1>404</h1>
            } />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    );
  }
}
