import React from 'react';
import { AreaChart, XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="label">{`${label} : ${payload[0].value}lbs`}</p>
      </div>
    );
  }

  return null;
};

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="chart">
        <ResponsiveContainer width="100%" aspect={2} key={`z${this.props.data[0].weight}`}>
          <AreaChart data={this.props.data} margin={{
            top: 45,
            right: 40,
            left: 40,
            bottom: 0
          }} key={`a${this.props.data[0].weight}`}>
            <XAxis dataKey="date" stroke="#ffffff" interval={0}/>
            <YAxis hide={true} stroke="#ffffff" domain={[185, 210]} />
            <Tooltip content={<CustomTooltip />} position={{ x: 20, y: -10 } } />
            <Area type="monotone" dataKey="weight" stroke="#ffffff" fill="#ffffff" key={`b${this.props.data[0].weight}`}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
