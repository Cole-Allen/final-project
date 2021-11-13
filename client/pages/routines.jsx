import React from 'react';
import AppContext from '../lib/app-context';

export default class Routines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch(`/api/${window.localStorage.getItem('jwt')}/routines`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          this.setState({
            data: data,
            loading: false
          });
        }
      });
  }

  handleClick(e) {
    window.location = '#routine' + '?id=' + e.currentTarget.getAttribute('data-key');
  }

  handleAdd() {
    fetch(`/api/${this.context.user.userId}/routines`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    }).then(res => res.json())
      .then(data => {
        this.loadData();
      });

  }

  render() {

    if (this.state.loading) {
      return <h1>Loading</h1>;
    }

    const list = [];

    for (const i in this.state.data) {
      list.push(
        <div className="routines-item" key={i} data-key={this.state.data[i].playlistId} onClick={this.handleClick}>
          <div className="routines-item-img">
            <img src='./images/smallerprofile.png'/>
          </div>
          <div className="routines-item-text">
            {this.state.data[i].name}
          </div>

        </div>
      );
    }

    return (
      <div className="routines">
        <div className="routines-title">
          <a href="#home" className="back-button">
            <i className="fas fa-caret-left"></i>
          </a>
          <h1>Routines</h1>
        </div>
        <div className="routines-list">
          {list}
          <div className="routines-add-button" onClick={this.handleAdd}>
            <i className="fas fa-plus"></i>
          </div>
        </div>
      </div>
    );
  }
}

Routines.contextType = AppContext;
