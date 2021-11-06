import React from 'react';
import Redirect from '../lib/redirect';
import Pane from '../component/pane';
import Panel from '../component/panel';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';

const data = [{
  name: 'test 1',
  amount: 10,
  exerciseId: 0
},
{
  name: 'test 2',
  amount: 20
}];

export default class CreatePlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'New playlist'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePanelClick = this.handlePanelClick.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handlePanelClick() {
    console.log('test');
  }

  handleAdd() {
    console.log('add');
  }

  render() {
    const exerciseArray = [];

    for (const i in data) {
      exerciseArray.push(
        <Panel key={i}>
          {data[i].name}
        </Panel>
      );
    }

    return (
      <div className="create-a-playlist">
        <div className="playlist-header">
          <a href="#home">
            <i className="fas fa-home"></i>
          </a>
          Create a playlist
        </div>
        <div className="playlist-left">

          <div className="playlist-image">
            <img src="./images/smallerprofile.png" />
          </div>
          <input className="playlist-name-input" type='text' value={this.state.value} onChange={this.handleChange}/>
          <div className="playlist-spotify">
            Spotify
            <Panel onClick={this.handlePanelClick}>
              Spotify playlist goes here
            </Panel>
          </div>
        </div>
        <div className="playlist-right">
          <Pane title="Muscles">
            <div className="muscle-graph">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <Tooltip />
                <XAxis type="number" stroke="#ffffff"/>
                <YAxis type="category" dataKey="name" stroke="#ffffff" />
                <Bar dataKey="amount" fill="#ff2f2f" />
              </BarChart>
              </ResponsiveContainer>
            </div>
          </Pane>
          <div className="playlist-exercise">
            <Panel onClick={this.handleAdd}>
              This panel will let you add an exercise
            </Panel>
            {exerciseArray}
          </div>
        </div>

      </div>

    );
  }
}
