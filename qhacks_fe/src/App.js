import React, { Component } from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {  XYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  LineSeriesCanvas, GradientDefs} from 'react-vis';
import firebase from './firebase.js';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: []
    };
  };
  componentDidMount() {
    const envRef = firebase.database().ref('data');
    envRef.on('value', (snapshot) => {
      let data = snapshot.val();
      let newState = [];
      for (let Predicted_PM_25 in data) {
        newState.push({
          id: Predicted_PM_25,
          Predicted_PM_25: data[Predicted_PM_25].Predicted_PM_25,
          TEMP: data[Predicted_PM_25].TEMP,
          HUM: data[Predicted_PM_25].HUM,
          TIME: data[Predicted_PM_25].timestamp
        });
      }
      this.setState({
        data: newState
      });
    });
  };

  render() {
    const {useCanvas} = this.state;
    const Line = useCanvas ? LineSeriesCanvas : LineSeries;

    const TIME = this.state.data.map((Predicted_PM_25) => Predicted_PM_25.TIME);


    const Pred_PM = this.state.data.map((Predicted_PM_25) => Predicted_PM_25.Predicted_PM_25);
    const Pred_PM_Plot = [];

    const TEMP = this.state.data.map((Predicted_PM_25) => Predicted_PM_25.TEMP);
    const TEMP_Plot = [];

    const HUM = this.state.data.map((Predicted_PM_25) => Predicted_PM_25.HUM);
    const HUM_Plot = [];

    var timeInt;

    for (var i = 0; i < Pred_PM.length; i++){
      timeInt = TIME[i].slice(-9);
      //(timeInt.slice(0, 3)*60*60 + timeInt.slice(4, 6)*60 + timeInt.slice(-2))*10
      Pred_PM_Plot.push({x:i, y:Pred_PM[i]});
      TEMP_Plot.push({x:i, y:TEMP[i]});
      HUM_Plot.push({x:i, y:HUM[i]});
    }

    const gradientPM = (<GradientDefs>
      <linearGradient
          id="pmGradient"
          gradientUnits="userSpaceOnUse"
          x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="12%" stopColor="#FF0000" />
          <stop offset="24%" stopColor="#FF9901" />
          <stop offset="36%" stopColor="#FFFF02" />
          <stop offset="48%" stopColor="#66CC01" />
          <stop offset="100%" stopColor="#01CC00" />
      </linearGradient>
    </GradientDefs>);

const gradientTEMP = (<GradientDefs>
  <linearGradient
      id="tempGradient"
      gradientUnits="userSpaceOnUse"
      x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FE2807" />
      <stop offset="50%" stopColor="#84E3FF" />
  </linearGradient>
</GradientDefs>);


const gradientHUM = (<GradientDefs>
  <linearGradient
      id="humGradient"
      gradientUnits="userSpaceOnUse"
      x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#054C8E" />
      <stop offset="50%" stopColor="#488ECC" />
  </linearGradient>
</GradientDefs>);

const bigAxisStyle = {
  ticks: {
    fontSize: '14px',
    color: '#333'
  },
  title: {
    fontSize: '21px'
  }
};


const smallAxisStyle = {
  ticks: {
    fontSize: '10px',
    color: '#333'
  },
  title: {
    fontSize: '16px'
  }
};


    return (
      <div>
        <div class="topnav">
        <center><h1 class="title">Clair.ai</h1></center>
        </div>
        <center><h1>24 Hour Predicted PM 2.5</h1></center>
        <XYPlot width={1700} height={600} yDomain={[0, 300]}>
          {gradientPM}
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis style={bigAxisStyle} title="Time"/>
          <YAxis style={bigAxisStyle} title="PM2.5"/>
          <Line
            className="first-series"
            data={Pred_PM_Plot}
            color={'url(#pmGradient)'}
            
          />
        </XYPlot>
        <div class="top">
        <h2 class="left-title">Temperature Input</h2>
        <h2 class="right-title">Humidity Input</h2>
        </div>
        <div class="top">
        <XYPlot width={850} height={400} yDomain={[-12, 0]}>
          {gradientTEMP}
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis style={smallAxisStyle} title="Time"/>
          <YAxis style={smallAxisStyle} title="Temp in C"/>
          <Line
            className="third-series"
            data={TEMP_Plot}
            color={'url(#tempGradient)'}
          />
        </XYPlot>
        <XYPlot width={850} height={400} yDomain={[70, 100]}>
        {gradientHUM}
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis style={smallAxisStyle} title="Time"/>
          <YAxis style={smallAxisStyle} title="Humidity %"/>
          <Line
            className="third-series"
            data={HUM_Plot}
            color={'url(#humGradient)'}
          />
        </XYPlot>
        </div>
      </div>
    );
  }
}

export default App;


