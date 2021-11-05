import React from 'react';
import AppContext from '../lib/app-context';
import decodeToken from '../lib/decode-token';
import Redirect from '../lib/redirect';
import Pane from '../component/pane';

const body = {
  body: 'Hello! This is an empty pane that will be used to quickly get to a workout!'
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // Fetch user data here
  }

  render() {
    if (!this.context.user) {
      return <Redirect to="#login"/>;
    }
    const token = decodeToken(window.localStorage.getItem('jwt'));

    return (
      <div className="home">
        <h1 className="home-title">Home</h1>
        <div className="home-profile-image">
          <img />
        </div>
        <h2 className="home-greeting">Hello, {token.firstName}!</h2>
        <Pane title="Weight" type="chart" history=""/>
        <Pane title={`${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date().getDay())} ${new Date().getDate()}`} body={body.body}/>
        <div className="logout">
          <a href="#login" onClick={this.props.onSignOut}>Log Out</a>
        </div>

      </div>
    );
  }

}

Home.contextType = AppContext;
