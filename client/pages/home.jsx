import React from 'react';
import AppContext from '../lib/app-context';
import decodeToken from '../lib/decode-token';
import Redirect from '../lib/redirect';
import Pane from '../component/pane';
import Graph from '../component/graph';

const token = decodeToken(window.localStorage.getItem('jwt'));

const welcomePane = {
  title: `${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date().getDay())} ${new Date().getDate()}`,
  body: 'Hello! This is an empty pane that will be used to quickly get to a workout routine!'
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

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      weight: '',
      editing: false,
      dayId: '',
      loading: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
    this.setState({
      loading: false
    });
  }

  loadData() {
    const date = new Intl.DateTimeFormat('en-US').format(new Date());
    let dayData;
    fetch(`/api/${token.userId}/weight`)
      .then(res => res.json())
      .then(data => {
        for (const i in data) {
          if (date === new Intl.DateTimeFormat('en-US').format(new Date(data[i].date))) {
            dayData = data[i];
          }
        }
        if (dayData) {
          this.setState({
            weight: dayData.weight,
            dayId: dayData.historyId
          });
        } else {
          this.setState({
            error: 'Loading error'
          });
        }
      });
  }

  handleChange(e) {
    this.setState({
      weight: e.target.value
    });
  }

  handleClick(e) {
    this.setState({
      editing: true
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      editing: false
    });
    if (this.state.dayId) {
      fetch(`/api/weight/${this.state.dayId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then(res => {
          if (!res.ok) {
            this.setState({ error: 'An unexpected error occurred' });
          }
          return res.json();
        });

    } else {
      fetch(`/api/${token.userId}/weight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then(res => {
          if (!res.ok) {
            this.setState({ error: 'An unexpected error occurred' });
          }
          return res.json();
        })
        .then(data => {
          this.setState({
            dayId: data.historyId
          });
        });
    }

  }

  render() {
    const weightTitleNE = this.state.weight ? `${this.state.weight} lbs` : 'Weight not set';

    const weightTitle = this.state.editing
      ? <form method="POST" className="weight-form">
        <label className="weight-title">
          <input className="weight-input" type="number" onChange={this.handleChange} value={this.state.weight} /> lbs
        </label>
        <button className="weight-button" type='submit' onClick={this.handleSubmit}>
          <i className="far fa-plus-square"></i>
          </button>
    </form>
      : <div>
        {weightTitleNE}
        <button className="weight-button" onClick={this.handleClick}>
          <i className="far fa-calendar-plus"></i>
        </button>
      </div>;

    const error = this.state.error ? <div className="error">{this.state.error}</div> : '';

    if (this.state.loading) {
      return <div>Loading</div>;
    }

    if (!this.context.user) {
      return <Redirect to="#login"/>;
    }

    return (
      <div className="home">
        <h1 className="home-title">Home</h1>
        {error}
        <div className="home-head">
          <div className="home-profile-image">
            <img src="./images/smallerprofile.png" />
          </div>
          <h2 className="home-greeting">Hello, {token.firstName}!</h2>
          <div className="home-welcome-pane">
            <Pane title={welcomePane.title} settings="#calender">
              <div className="pane-body">
                {welcomePane.body}
              </div>
            </Pane>
          </div>
        </div>

        <div className="widgets">
          <Pane unique={weightTitle} title="Weight" history="" settings="#weight-history">
            <Graph data={data}/>
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
