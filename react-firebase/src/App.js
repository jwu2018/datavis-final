import React, { Component } from 'react';
import './App.css';
import fire from './firebase';
// import { fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS } from './all-charts';
import { shuffle } from 'd3-array';
import team_members from './team-members.jpg'
import bars from './images/bars.png'
import hop from './images/hop.png'
import dots from './images/dots.png'
import { generate_hourly_data, baseline_text } from './data-generation';

import { Survey } from './Survey';
import { ExitSurvey } from './ExitSurvey';
import { Question, QUESTION_TYPES } from './Question';
import { build_barchart } from './bar-charts';
import { handleDotPlots } from './dotplot';
import build_animated_hop from './d3-hops';

const CHARTS = {
  text: 'Text',
  bar: 'Static Bar Chart',
  hop: 'Hypothetical Outcome Plot',
  dot: 'Quantile Dot Plot',
}

const PAGES = {
  welcome: 'Welcome',
  instructions: 'Instructions',
  experiment: 'Experiment',
  about: 'About',
  survey: 'Survey',
  exitSurvey: 'ExitSurvey',
  thanks: 'Thanks'
}

// const TRIALS = [
//   CHARTS.bar, CHARTS.bar, CHARTS.bar, CHARTS.bar, CHARTS.bar,
//   CHARTS.hop, CHARTS.hop, CHARTS.hop, CHARTS.hop, CHARTS.hop,
//   CHARTS.text, CHARTS.text, CHARTS.text, CHARTS.text, CHARTS.text,
//   CHARTS.dot, CHARTS.dot, CHARTS.dot, CHARTS.dot, CHARTS.dot,
// ]
const TRIALS = []
for (let chartType in CHARTS){
  for (let questionType in QUESTION_TYPES){
    TRIALS.push({
      chartType: CHARTS[chartType], 
      questionType: QUESTION_TYPES[questionType],
    })
  }
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function shuffleArray(array) {
  let arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice()
}

const SESSION_ID = uuidv4();
console.log(`Session ID: ${SESSION_ID}`);

function renderChartTarget() {
  return <div id="svgcontainer"></div>
}

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: PAGES.welcome,
      demographic: null,
      exitSurveyResults: null,
      dataset: [],
      sessionID: SESSION_ID,
    }
  }

  handleSurvey = response => {
    this.setState({ demographic: response });
    this.setPage(PAGES.experiment);
  }
  
  handleExitSurvey = response => {
    this.setState({ exitSurveyResults: response },() =>{
      fire.database().ref('data').push(this.state);
    });    
    this.setPage(PAGES.thanks);
    console.log('Exit survey handled!!')
  }

  handleDataset = dataset => {
    this.setState({ dataset: dataset });
  }

  handleOrder = order => {
    this.setState({ order: order });
  }

  handleTrials = trials => {
    this.setState({ trials: trials });
  }

  resetData = () => {
    this.setState({dataset: []});
  }

  setPage = newPage => {
    this.setState({ page: newPage });
    if (document.getElementById(newPage))
      document.getElementById(newPage).classList.add('curPage');
  }

  renderContent() {
    switch (this.state.page) {
      case PAGES.welcome:
        return <Welcome setPage={this.setPage} />
      case PAGES.instructions:
        return <Instructions setPage={this.setPage} />
      case PAGES.experiment:
        return (
          <Experiment
            dataset={this.state.dataset}
            handleDataset={this.handleDataset}
            demographics={this.state.demographic}
            order={this.state.order}
            trials={this.state.trials}
            handleOrder={this.handleOrder}
            handleTrials={this.handleTrials}
            setPage={this.setPage}
          />
        );
      case PAGES.survey:
        return (
          <Survey
            demographic={this.state.demographic}
            handleSurvey={this.handleSurvey}
          />
        );
      case PAGES.exitSurvey:
        // TODO: This function renders the exit survey but I think it needs to handle ending the survey afterwards
        return <ExitSurvey
                  exitSurveyResults={this.state.exitSurveyResults}
                  handleExitSurvey={this.handleExitSurvey}
                />
      case PAGES.about:
        return <About />
      case PAGES.thanks:
        return <Thanks
          setPage={this.setPage}
          resetData={this.resetData}
        />
      default:
        return (
          <div>
            <h2>Lost</h2>
            <p>Please select a page from the top bar to continue.</p>
          </div>
        )
    }
  }

  render() {
    return (
      <div>
        <div className="top-bar">
          <div className="top-bar-left">
            <ul className="menu">
              <li className="menu-text">CS 573 Data Vis Project 3</li>
              <li><button id="Welcome" className="" class="button curPage">Welcome</button></li>
              <li><button id="Instructions" className="button">Instructions</button></li>
              <li><button id="Survey" className="button">Background Survey</button></li>
              <li><button id="Experiment" className="button">Experiment</button></li>
              <li><button id="ExitSurvey" className="button">Exit Survey</button></li>
              <li><button id="Thanks" className="button">Thanks!</button></li>
            </ul>
          </div>
        </div>
        <div className="page-container">
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

function About() {
  return (
    <div>
      <h2>About</h2>
      <p>This project was created by Imogen Cleaver-Stigum, Andrew Nolan, Matt St. Louis, and Jyalu Wu
         for CS 573.</p>
      <img src="team_members.jpg" alt="Picture of the team members"></img>
    </div>
  )
}

function Welcome(props) {
  document.title = "CS 573 - Welcome"
  return (
    <div>
      <h2>Welcome!</h2>
      <p>
        Welcome to our Data Vis Project! Thank you for taking a few minutes of
        your day to help us out. This survey is meant to study the differences and effectiveness in uncertainy visualizations for weather data. This is part of our final project for CS 573 Data Visualization and was created by Imogen Cleaver-Stigum, Andrew Nolan, Matt St. Louis, and Jyalu Wu. For the best experience, please use a laptop or a computer instead of a mobile device.
      </p>
      <img src={team_members} alt="Picture of the team members"></img>
      <br></br><br></br>
      <button type="button" className="button" onClick={() => props.setPage(PAGES.instructions)}>
        Get Started
      </button>
    </div>
  )
}

function Instructions(props) {
  document.title = "Instructions"
  return (
    <div>
      <h2>Instructions</h2>
      <p>Here we describe key terms and visualizations you will see in this survey:</p>
      <h3>Probability of Precipitation</h3>
      <p>The probability of precipitation is a percent value (10%, 100%, etc) that represents the chance that precipitation will occur. For example, a 10% probability of precipitation means that there is a 10% chance of any amount of rain happening, and a 90% chance of no rain at all. </p>
      <h3>Amount of Precipitation</h3>
      <p>The amount of precipitation is always in units of inches per hour. </p>
      <ul>
        <li>Up to 0.1 inches per hour is “light precipitation”</li>
        <li>0.1-0.3 inches per hour is “moderate precipitation”</li>
        <li>0.3 or more inches per hour is “heavy precipitation”</li>
      </ul>
      <h3>Text</h3>
      <p>This text describes the precipitation forecast for tomorrow afternoon. <br/><br/>
        The following describes the chance of precipitation for tomorrow:<br/>
        - At 5:00 pm, there is a 30% chance of moderate precipitation.<br/>
        - At 6:00 pm, there is a 15% chance of light precipitation.<br/>
        - At 7:00 pm, there is a 30% chance of moderate precipitation.<br/>
        - At 8:00 pm, there is a 30% chance of moderate precipitation.<br/>
        - At 9:00 pm, there is no chance of precipitation.
      </p>
      <h3>Bar Plot</h3>
      <p>These bar plots show the precipitation forecast for tomorrow. The y-axis is the predicted rate of precipitation (e.g. 0.2 in/hr) and the x-axis is the time (e.g. 1PM). Each bar represents a different hour and is colored based on the amount of precipitation (light, moderate, or heavy).</p>
      <img src={bars} alt="The weather bar chart"></img>
      <h3>Hypothetical Outcome Plot</h3>
      <p>Hypothetical outcome plots (HOPs) are like bar plots but upgraded. They are animated to show many hypothetical predictions of how much rain you might get based on the chances of precipitation for each hour. Each second of the animation shows a different hypothetical prediction of tomorrow’s weather forecast.</p>
      <p>Like the bar plots, HOPs have a different bar for each hour and are colored based on the amount of precipitation.</p>
      <img src={hop} alt="The hypothetical outcome plot"></img>
      <h3>Quantile Dot Plot</h3>
      <p>These dot plots describe the precipitation forecast for tomorrow afternoon. The plots are iterating through each hour of the afternoon (1pm, 2pm, 3pm, etc) to show how the predictions change over the course of the afternoon.</p>
      <p>The dropdown menu allows you to choose a particular time of day to get a closer look at the forecast for that time of day.</p>
      <img src={dots} alt="The quantile dot plot"></img>
      <br></br><br></br>
      <button type="button" className="button" onClick={() => props.setPage(PAGES.survey)}>
        I'm ready to go!
      </button>
    </div>
  )
}

class Experiment extends Component {
  setPage;
  constructor(props) {
    document.title = "Experiment"
    super(props);
    const order = shuffleArray(TRIALS);
    let type = order[0].chartType;
    let questionType = order[0].questionType;
    let points = generate_hourly_data();
    // let markedIndices = indices_to_compare(DATAPOINT_COUNTS[type]);
    // let { high, low } = this.getHighLow(points, markedIndices);
    this.setPage = props.setPage;

    this.state = {
      demographics: props.demographics,
      order: order,
      trials: [{
        guess: null,
        // high: high,
        // low: low,
        type: type,
        questionType: questionType,
        // markedIndices: markedIndices,
        points: points,
      }],
    };
  }

  nextTrial = guess => {
    const trials = this.state.trials.slice();
    trials[trials.length - 1].guess = guess;

    let type = this.state.order[trials.length - 1].chartType;
    let questionType = this.state.order[trials.length - 1].questionType;
    let points = generate_hourly_data();
    // let markedIndices = indices_to_compare(DATAPOINT_COUNTS[type]);
    // let { high, low } = this.getHighLow(points, markedIndices)

    trials.push({
      guess: guess,
      // high: high,
      // low: low,
      type: type,
      questionType: questionType,
      // markedIndices: markedIndices,
      points: points,
    });
    this.setState({
      trials: trials,
      },()=>{
        if (trials.length === 3){//TRIALS.length) {
          // this.uploadToFirebase(guess);
          this.props.handleTrials(this.state.trials)
          this.setPage(PAGES.exitSurvey);
        }
    })
  }

  uploadToFirebase = e => {
    let dataRef = fire.database().ref('data').orderByKey();
    fire.database().ref('data').push(this.state);
  }

  getHighLow = (array, indices) => {
    if (array[indices.random_idx] > array[indices.other_idx]) {
      return { high: array[indices.random_idx], low: array[indices.other_idx] };
    }
    return { high: array[indices.other_idx], low: array[indices.random_idx] };
  }

  handleChange = e => {
    this.setState({
      select: e.target.value,
    })
  }

  render() {
    return (
      <div id="experiment">
        <h2>Experiment</h2>
        <p>Trial {this.state.trials.length} out of {this.state.order.length}</p>
        <VisForm
          // high={this.state.trials[this.state.trials.length - 1].high}
          // low={this.state.trials[this.state.trials.length - 1].low}
          type={this.state.trials[this.state.trials.length - 1].type}
          questionType={this.state.trials[this.state.trials.length - 1].questionType}
          // markedIndices={this.state.trials[this.state.trials.length - 1].markedIndices}
          points={this.state.trials[this.state.trials.length - 1].points}
          nextTrial={this.nextTrial}
          key={this.state.trials.length - 1}
        />
      </div>
    )
  }
}

class VisForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: null,
      message: this.props.message,
      intervals: [],
    }
  }

  handleChange = e => {
    this.setState({
      guess: e.target.value,
      message: this.state.message,
    });
  }

  handleSubmit = e => {
    if (this.guessIsValid()) {
      this.state.intervals.map(i => clearInterval(i))
      this.props.nextTrial(this.state.guess)
    }
  }

  guessIsValid = () => {
    return true
    // return this.state.guess && (0 < this.state.guess && this.state.guess <= 1);
  }

  componentDidMount() {
    if(this.props.type === CHARTS.text) {
      document.querySelector('#svgcontainer').innerHTML = baseline_text(this.props.points[0], this.props.points[1])
    } else if(this.props.type === CHARTS.bar) {
      build_barchart(this.props.points[0], this.props.points[1])
    } else if(this.props.type === CHARTS.dot) {
      handleDotPlots(this.props.points);
    } else if(this.props.type === CHARTS.hop) {
      this.state.intervals.push(build_animated_hop(this.props.points))
    }
  }

  renderError() {
    // return this.guessIsValid() ? null : <p>Please enter a valid guess before continuing.</p>
    return null;
  }

  render() {
    return (
      <div className="vis-form">
        <h3>{this.props.type}</h3>
        {renderChartTarget()}
        <form>
          <Question type={this.props.questionType}/>
          <br />
          <button
            type="submit"
            className="button"
            disabled={!this.guessIsValid()}
            onClick={this.handleSubmit}
          >Next</button>
        </form>
        {this.renderError()}
      </div>
    );
  }
}

function Thanks(props) {
  document.title = "Thanks!"
  return (
    <div>
      <h2>Thanks!</h2>
      <p>
        Thanks for taking our survey! If you want to participate again, press here:
      </p>
      <button type="button" className="button" onClick={() => {
        //document.getElementById('Experiment').classList.remove('curPage');
        document.getElementById('Thanks').classList.remove('curPage');
        document.getElementById('ExitSurvey').classList.remove('curPage');
        props.resetData()
        props.setPage(PAGES.experiment)
      }}>
        Complete Again
      </button>
    </div>
  )
}

class App extends Component {

  state = {
    inputText: "",
    test: "test"
  }

  changeText = e => {
    this.setState({
      inputText: e.target.value
    });
  }

  uploadToFirebase = e => {
    let dataRef = fire.database().ref('data').orderByKey();
    fire.database().ref('data').push(this.state);
    this.setState({
    });
  }

  render() {
    return (
      <div>
        {/* <div className="App-header"> */}
        {/* <input type="text" id="inputText" onChange={this.changeText}></input> */}
        {/* <br/> */}
        {/* <button onClick={this.submit}>Submit Data</button> */}
        {/* </div> */}
        <Page />
      </div>
    );
  }
}

export default App;
