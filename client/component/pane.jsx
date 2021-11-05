import React from 'react';

export default class Pane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    return (
      <div className="pane">
        <div className="pane-title">
          {this.props.title}
          <div className="icons">
            <a className="schedule-icon" href="#schedule">
              <i className="fas fa-calendar-alt"></i>
            </a>
            <a href="#settings">
              <i className="fas fa-cog"></i>
            </a>
          </div>

        </div>
          {this.props.children}

      </div>
    );
  }
}
