import React from 'react';
import Redirect from '../lib/redirect';
import Pane from '../component/pane';
import Panel from '../component/panel';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';

const data = [{
  name: 'Curl',
  amount: {
    sets: 10,
    reps: 10,
    weight: 15
  },
  exerciseId: 1,
  muscle: {
    name: 'Bicep',
    heat: 100
  }
},
{
  name: 'Curl',
  amount: {
    sets: 20,
    reps: 10,
    weight: 15
  },
  exerciseId: 0,
  muscle: {
    name: 'Bicep',
    heat: 100
  }
},
{
  name: 'Crush',
  amount: {
    sets: 10,
    reps: 10,
    weight: 15
  },
  exerciseId: 0,
  muscle: {
    name: 'Tricep',
    heat: 100
  }
}];

export default class CreatePlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'New playlist',
      addPanel: false
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
    this.setState({
      addPanel: !this.state.addPanel
    });
  }

  render() {
    const exerciseArray = [];

    const hidden = this.state.addPanel ? '' : 'hidden';
    const scooch = this.state.addPanel ? 'scooch' : '';

    for (const i in data) {

      exerciseArray.push(
        <Panel key={i}
          title={`${data[i].name} ${i}`}>
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
        <div className={`playlist-left ${scooch}`}>

          <div className="playlist-image">
            <img src="./images/smallerprofile.png" />
          </div>
          <input className="playlist-name-input" type='text' value={this.state.value} onChange={this.handleChange}/>
          <div className="playlist-spotify">
            Spotify
            <Panel onClick={this.handlePanelClick}
              title="Spotify playlist goes here">
            </Panel>
          </div>
        </div>
        <div className={`playlist-right ${scooch}`}>
          <Pane title="Muscles">
            <div className="muscle-graph">
            <ResponsiveContainer width="100%" height={300} key={data.length}>
              <BarChart
                layout="vertical"
                data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                <Tooltip />
                <XAxis type="number" stroke="#ffffff"/>
                <YAxis type="category" dataKey="muscle.name" stroke="#ffffff" />
                  <Bar dataKey="amount.sets" fill="#ff2f2f" key={`b${data.length}`}/>
              </BarChart>
              </ResponsiveContainer>
            </div>
          </Pane>
          <div className="playlist-exercise">
            <Panel onClick={this.handleAdd}
              title="This panel will let you add an exercise">
            </Panel>
            {exerciseArray}
          </div>
        </div>
        <div className={`add-panel ${hidden}`}>
          <div className="playlist-add-exercise">
            {exerciseArray}
          </div>
        </div>

      </div>

    );
  }
}
