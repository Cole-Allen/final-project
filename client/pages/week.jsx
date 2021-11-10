import React from 'react';
import AppContext from '../lib/app-context';
import Pane from '../component/pane';

export default class Week extends React.Component {
  render() {
    return (
      <div>
        <div className="week-head">
          <a href="#home" className="back-button">
            <i className="fas fa-caret-left"></i>
          </a>

          <h1 className="week-title">Week</h1>
        </div>
        <div className="week-body">
          <Pane title="Sunday">
            You will be able to put routines here!
          </Pane>
          <Pane title="Monday">
            You will be able to put routines here!
          </Pane>
          <Pane title="Tuesday">
            You will be able to put routines here!
          </Pane>
          <Pane title="Wednesday">
            You will be able to put routines here!
          </Pane>
          <Pane title="Thursday">
            You will be able to put routines here!
          </Pane>
          <Pane title="Friday">
            You will be able to put routines here!
          </Pane>
          <Pane title="Saturday">
            You will be able to put routines here!
          </Pane>
        </div>

      </div>

    );
  }
}

Week.contextType = AppContext;
