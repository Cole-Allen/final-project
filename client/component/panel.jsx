import React from 'react';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.onClick) { this.props.onClick(); }
  }

  render() {
    return (
      <div className="panel" onClick={this.handleClick}>
        <div className="panel-image">
          <img src="./images/smallerprofile.png" />
        </div>
        <div className="panel-text">
          <div className="panel-text-title">
            {this.props.title}
          </div>
          <div className="panel-text-subtext">

          </div>
        </div>
        <i className="fas fa-caret-right"></i>
      </div>
    );
  }

}
