import React from 'react';
import { AreaChart, XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="label">{`October ${label} : ${payload[0].value}lbs`}</p>
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
        <ResponsiveContainer width="100%" aspect={2}>
          <AreaChart data={this.props.data} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
            <XAxis dataKey="date" stroke="#ffffff" interval={0}/>
            <YAxis hide={true} stroke="#ffffff" domain={[185, 210]} />
            <Tooltip content={<CustomTooltip />} position={{ x: 0, y: 0 } } />
            <Area type="monotone" dataKey="weight" stroke="#ffffff" fill="#ffffff"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
