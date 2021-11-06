import React from 'react';
import AppContext from '../lib/app-context';
import decodeToken from '../lib/decode-token';
import Redirect from '../lib/redirect';
import Pane from '../component/pane';
import Graph from '../component/graph';
import Panel from '../component/panel';

const welcomePane = {
  title: `${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date().getDay())} ${new Date().getDate()}`,
  body: 'No workout scheduled! Add one now >'
};

const data = [
  {
    date: '1',
    weight: 200
  },
  {
    date: '2',
    weight: 198.1
  },
  {
    date: '3',
    weight: 200
  },
  {
    date: '4',
    weight: 198
  },
  {
    date: '5',
    weight: 204
  },
  {
    date: '6',
    weight: 192
  },
  {
    date: '7',
    weight: 190
  }
];

export default class Home extends React.Component {

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
          <img src="./images/smallerprofile.png"/>
        </div>
        <h2 className="home-greeting">Hello, {token.firstName}!</h2>
        <Pane title={welcomePane.title}>
          <div>
            <Panel>
              No playlist set. Make one now?
            </Panel>
          </div>
        </Pane>
        <div className="widgets">
          <Pane title="Weight" history="">
            <Graph data={data}/>
          </Pane>
          <Pane title="Weight" history="">
            <Graph data={data} />
          </Pane>
          <Pane title="Weight" history="">
            <Graph data={data} />
          </Pane>
          <Pane title="Weight" history="">
            <Graph data={data} />
          </Pane>
        </div>
        <div className="logout">
          <a href="#login" onClick={this.props.onSignOut}>Log Out</a>
        </div>

      </div>
    );
  }

}

Home.contextType = AppContext;
