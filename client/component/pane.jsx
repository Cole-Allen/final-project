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
          <div className="pane-unique">
            {this.props.unique}
          </div>
          <div className="icons">
            <a href={this.props.settings}>
              <i className="fas fa-cog" ></i>
            </a>
          </div>

        </div>
          {this.props.children}

      </div>
    );
  }
}
