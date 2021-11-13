import React from 'react';
import Pane from '../component/pane';
import AppContext from '../lib/app-context';

export default class Routine extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(window.location.hash.replace('#routine?id=', '')),
      loading: true,
      nameValue: ''
    };
    this.loadData = this.loadData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveData = this.saveData.bind(this);
    this.handleSpotify = this.handleSpotify.bind(this);
  }

  saveData() {
    fetch(`/api/routine/${this.state.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then();
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch(`/api/routine/${this.state.id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          loading: false,
          nameValue: data[0].name
        });
      });

  }

  onChange(e) {
    this.setState({
      nameValue: e.target.value
    });
  }

  render() {

    if (this.state.loading) {
      return <h1>Loading</h1>;
    }
    return (
      <div className="routine">
        <div className="routine-back">
          <a href="#routines" className="back-button">
            <i className="fas fa-caret-left"></i>
          </a>
          <i className="routine-save fas fa-save" onClick={this.saveData}></i>

        </div>
        <div className="routine-head">
          <div className="routine-img">
            <img src="./images/smallerprofile.png"/>
          </div>
          <div className="routine-name">
            <input
            value={this.state.nameValue}
            size={this.state.nameValue.length}
            onChange={this.onChange}></input>
          </div>
          <div className="routine-spotify">
            <Pane title="Spotify playlist">
              <a href="#settings">Spootify</a>
            </Pane>

          </div>

        </div>
      </div>
    );
  }
}

Routine.contextType = AppContext;
