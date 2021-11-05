import React from 'react';
import Graph from './graph';

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

export default class Pane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    let body;
    if (this.props.type === 'chart') {
      if (data) {
        body = <Graph data={data} />;
      } else {
        body = <div className="pane-body">
          No data found!
        </div>;
      }

    } else {
      body =
      <div className="pane-body">
        {this.props.body}
      </div>;
    }
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
        {body}
      </div>
    );
  }
}
