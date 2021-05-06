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
import { Help, Instructions } from './Instructions';

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
              <li className="menu-text">CS 573 Data Vis Final Project</li>
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

  nextTrial = (confidence, followUp, followUpText, mainAnswer, askedForHelp) => {
    const trials = this.state.trials.slice();
    trials[trials.length - 1].confidence = confidence;
    trials[trials.length - 1].followUp = followUp;
    trials[trials.length - 1].followUpText = followUpText;
    trials[trials.length - 1].mainAnswer = mainAnswer;
    trials[trials.length - 1].askedForHelp = askedForHelp;

    let type = this.state.order[trials.length - 1].chartType;
    let questionType = this.state.order[trials.length - 1].questionType;
    let points = generate_hourly_data();

    trials.push({
      type: type,
      questionType: questionType,
      points: points,
    });
    this.setState({
      trials: trials,
      },()=>{
        if (trials.length === TRIALS.length+1) {
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
      message: this.props.message,
      intervals: [],
      showHelp: false,
      askedForHelp: false,
      MainAnswer: "",
      Confidence: "Very favorable",
      FollowUp: "",
      FollowUpText:""
    }
  }

  toggleHelp = () => this.setState({ showHelp: !this.state.showHelp, askedForHelp: true });

  handleChangeMainAnswer = e => this.setState({MainAnswer: e.target.value})
  handleChangeConfidence = e => this.setState({Confidence: e.target.value})
  handleChangeAmount = e => this.setState({Amount: e.target.value})
  handleChangeFollowUp = e => this.setState({FollowUpText: e.target.value})

  handleSubmit = e => {
    if (this.guessIsValid()) {
      this.state.intervals.map(i => clearInterval(i))
      this.props.nextTrial(
        this.state.Confidence,
        this.state.FollowUp,
        this.state.FollowUpText,
        this.state.MainAnswer,
        this.state.askedForHelp,
      )
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

  renderHelp() {
    if(!this.state.showHelp) {
      return;
    }
    return <Help type={this.props.type}/>
  }

  render() {
    return (
      <div className="vis-form">
        <button type="button" className="button" onClick={this.toggleHelp}>
          {`${this.state.showHelp ? 'Hide' : 'Show'} Help`}
        </button>
        {this.renderHelp()}
        <h3>{this.props.type}</h3>
        {renderChartTarget()}
        <form>
          <Question 
            type={this.props.questionType}
            handleChangeMainAnswer={e => this.handleChangeMainAnswer(e)}
            handleChangeConfidence={e => this.handleChangeConfidence(e)}
            handleChangeAmount={e => this.handleChangeAmount(e)}
            handleChangeFollowUp={e => this.handleChangeFollowUp(e)}
            />
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
