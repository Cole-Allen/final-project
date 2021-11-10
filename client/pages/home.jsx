import React from 'react';
import AppContext from '../lib/app-context';
import Redirect from '../lib/redirect';
import Pane from '../component/pane';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      weight: '',
      date: '',
      editing: false,
      editingId: '',
      data: '',
      loading: true
    };

    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickTR = this.handleClickTR.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    if (!this.context.user.userId) {
      return;
    }
    fetch(`/api/${this.context.user.userId}/weight`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          this.setState({
            data: data,
            loading: false
          });
        }
      })
      .catch(err => console.error(err));
  }

  handleWeightChange(e) {
    this.setState({
      weight: e.target.value
    });
  }

  handleDateChange(e) {

    this.setState({
      date: e.target.value
    });
  }

  handleClick(e) {
    const date = new Date();
    const newData = this.state.data;
    const defaultEntry = {
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      weight: 0
    };
    fetch(`/api/${this.context.user.userId}/weight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(defaultEntry)
    })
      .then(res => {
        newData.push(defaultEntry);
        this.setState({
          data: newData
        });
        this.loadData();
      });

  }

  handleClickTR(e) {
    if (e.target.getAttribute('class') === 'fas fa-save' || e.target.getAttribute('class') === 'weight-input') {
      return;
    }
    this.setState({
      editing: true,
      editingId: e.currentTarget.getAttribute('historyid'),
      weight: e.currentTarget.getAttribute('weight'),
      date: e.currentTarget.getAttribute('date')
    });

  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      editing: false,
      editingId: ''
    });

    if (this.state.editingId) {
      fetch(`/api/weight/${this.state.editingId}`, {
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
          this.loadData();
          return res.json();
        });

    } else {
      fetch(`/api/${this.context.user.userId}/weight`, {
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
          this.loadData();
        });
    }
    this.loadData();

  }

  render() {
    if (!this.context.user) {
      return <Redirect to="#login" />;
    }

    if (this.state.loading) {
      return <div>Loading</div>;
    }

    const welcomePane = {
      title: `${new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric' }).format(new Date())}`,
      body: 'Hello! This is an empty pane that will be used to quickly get to a workout routine!'
    };

    const weightTitleNE =
    <div>
      <button className="weight-button" onClick={this.handleClick} >
        <i className="far fa-calendar-plus"></i>
      </button >
    </div>;

    const list = [];

    for (const i in this.state.data) {
      if (this.state.editing && this.state.data[i].historyId === parseInt(this.state.editingId)) {
        list.push(
          <tr
            key={list.length}
            className="weight-row"
            historyid={this.state.data[i].historyId}
            weight={this.state.weight}
            date={this.state.date}
            onClick={this.handleClickTR}>
            <td><input
            className="weight-input"
            type="date"
            value={this.state.date}
            onChange={this.handleDateChange}></input></td>
            <td><input
            className="weight-input"
            type="number"
            value={this.state.weight}
            onChange={this.handleWeightChange}></input>
              <button className="weight-button"
              onClick={this.handleSubmit} >
                <i className="fas fa-save"></i>
              </button ></td>
          </tr>
        );
      } else {
        list.push(
          <tr
            key={list.length}
            className="weight-row"
            historyid={this.state.data[i].historyId}
            weight={this.state.data[i].weight}
            date={this.state.data[i].date}
            onClick={this.handleClickTR}>
            <td>{this.state.data[i].date}</td>
            <td>{this.state.data[i].weight}</td>
          </tr>
        );
      }

    }

    const error = this.state.error ? <div className="error">{this.state.error}</div> : '';

    return (
      <div className="home">
        <h1 className="home-title">Home</h1>
        {error}
        <div className="home-head">
          <div className="home-profile-image">
            <img src="./images/smallerprofile.png" />
          </div>
          <h2 className="home-greeting">Hello, {this.context.user.firstName}!</h2>
          <div className="home-welcome-pane">
            <Pane title={welcomePane.title} settings="#calender">
              <div className="pane-body">
                {welcomePane.body}
              </div>
            </Pane>
          </div>
        </div>

        <div className="widgets">
          <Pane unique={weightTitleNE} title="Weight" history="" settings="#weight-history">
            <table className="weight-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {list}
              </tbody>
            </table>
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
