import React from 'react';
import AppContext from '../lib/app-context';

export default class Routines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [1, 1, 1, 1, 1, 1]
    };
  }

  handleClick(e) {
  }

  render() {

    const list = [];

    for (const i in this.state.data) {
      list.push(
        <div className="routine-item" key={i} data-key={i} onClick={this.handleClick}>
          <div className="routine-item-img">
            <img src='./images/smallerprofile.png'/>
          </div>
          <div className="routine-item-text">
            This is a placeholder!
          </div>

        </div>
      );
    }

    return (
      <div className="routines">
        <div className="routine-title">
          <a href="#home" className="back-button">
            <i className="fas fa-caret-left"></i>
          </a>
          <h1>Routines</h1>
        </div>
        <div className="routine-list">
          {list}
        </div>
      </div>
    );
  }
}

Routines.contextType = AppContext;
