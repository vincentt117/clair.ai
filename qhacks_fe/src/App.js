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
  LineSeriesCanvas} from 'react-vis';
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
          TEMP: data[Predicted_PM_25].TEMP

        });
      }
      this.setState({
        data: newState
      });
    });
  };

  render() {
    const {useCanvas} = this.state;
    const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
    const Line = useCanvas ? LineSeriesCanvas : LineSeries;

    const Pred_PM = this.state.data.map((Predicted_PM_25) => Predicted_PM_25.Predicted_PM_25);
    const Pred_PM_Plot = [];

    const TEMP = this.state.data.map((Predicted_PM_25) => Predicted_PM_25.TEMP);
    const TEMP_Plot = [];

    for (var i = 0; i < Pred_PM.length; i++){
      Pred_PM_Plot.push({x:i, y:Pred_PM[i]});
      TEMP_Plot.push({x:i, y:TEMP[i]});
    }
    return (
      <div>
        <XYPlot width={1920} height={1080}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis />
          <YAxis />
          <ChartLabel 
            text="X Axis"
            className="alt-x-label"
            includeMargin={false}
            xPercent={0.025}
            yPercent={1.01}
            />

          <ChartLabel 
            text="Y Axis"
            className="alt-y-label"
            includeMargin={false}
            xPercent={0.06}
            yPercent={0.06}
            style={{
              transform: 'rotate(-90)',
              textAnchor: 'end'
            }}
            />
          <Line
            className="first-series"
            data={Pred_PM_Plot}
          />
          <Line className="second-series" data={null} />
          <Line
            className="third-series"
            curve={'curveMonotoneX'}
            data={TEMP_Plot}
            strokeDasharray={useCanvas ? [7, 3] : '7, 3'}
          />
          <Line
            className="fourth-series"
            style={{
              // note that this can not be translated to the canvas version
              strokeDasharray: '2 2'
            }}
            data={[{x: 1, y: 7}, {x: 2, y: 11}, {x: 3, y: 9}, {x: 4, y: 2}]}
          />
        </XYPlot>
      </div>
    );
  }
}

export default App;


