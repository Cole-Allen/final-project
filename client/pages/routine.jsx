import React from 'react';
import Pane from '../component/pane';
import AppContext from '../lib/app-context';

export default class Routine extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(window.location.hash.replace('#routine?id=', ''))
    };
  }

  render() {
    return (
      <div className="routine">
        <div className="routine-back">
          <a href="#routines" className="back-button">
            <i className="fas fa-caret-left"></i>
          </a>
        </div>
        <div className="routine-head">
          <div className="routine-img">
            <img src="./images/smallerprofile.png"/>
          </div>
          <div className="routine-name">
            <input></input>
          </div>
          <div className="routine-spotify">
            <Pane title="Spotify playlist">
              asdasd
            </Pane>

          </div>

        </div>
      </div>
    );
  }
}

Routine.contextType = AppContext;
