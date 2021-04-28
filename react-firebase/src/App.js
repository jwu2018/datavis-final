import React, { Component } from 'react';
import './App.css';
import fire from './firebase';
import { fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS } from './all-charts';
import { shuffle } from 'd3-array';
import team_members from './team-members.jpg'

const PAGES = {
  welcome: 'Welcome',
  experiment: 'Experiment',
  about: 'About',
  survey: 'Survey',
  thanks: 'Thanks'
}

const TRIALS = [
  CHARTS.bar, CHARTS.bar, CHARTS.bar, CHARTS.bar, CHARTS.bar,
  CHARTS.pie, CHARTS.pie, CHARTS.pie, CHARTS.pie, CHARTS.pie,
  CHARTS.spiral, CHARTS.spiral, CHARTS.spiral, CHARTS.spiral, CHARTS.spiral,
]

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
      dataset: [],
      sessionID: SESSION_ID,
    }
  }

  handleSurvey = response => {
    this.setState({ demographic: response });
    this.setPage(PAGES.experiment);
  }

  handleDataset = dataset => {
    this.setState({ dataset: dataset });
  }

  resetData = () => {
    this.setState({dataset: []});
  }

  setPage = newPage => {
    this.setState({ page: newPage });
    document.getElementById(newPage).classList.add('curPage');
  }

  renderContent() {
    switch (this.state.page) {
      case PAGES.welcome:
        return <Welcome setPage={this.setPage} />
      case PAGES.experiment:
        return (
          <Experiment
            dataset={this.state.dataset}
            handleDataset={this.handleDataset}
            demographics={this.state.demographic}
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
              <li><button id="Survey" className="button">Background Survey</button></li>
              <li><button id="Experiment" className="button">Experiment</button></li>
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
        your day to help us out. This website is a replication of 
        <a href="https://www.jstor.org/stable/2288400?seq=1" rel="noopener noreferrer" target="_blank"> a paper on Graphical 
        Perception by Cleaveland and McGill.</a> This is part of an assignment
        for CS 573 Data Visualization and was created by Imogen Cleaver-Stigum, Andrew Nolan, Matt St.
        Louis, and Jyalu Wu. For the best experience, please use a laptop or a computer instead of a mobile device.
      </p>
      <img src={team_members} alt="Picture of the team members"></img>
      <br></br><br></br>
      <button type="button" className="button" onClick={() => props.setPage(PAGES.survey)}>
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
    let type = order[0];
    let points = gen_data(DATAPOINT_COUNTS[type]);
    let markedIndices = indices_to_compare(DATAPOINT_COUNTS[type]);
    let { high, low } = this.getHighLow(points, markedIndices);
    this.setPage = props.setPage;

    this.state = {
      demographics: props.demographics,
      order: order,
      trials: [{
        guess: null,
        high: high,
        low: low,
        type: type,
        markedIndices: markedIndices,
        points: points,
      }],
    };
  }

  nextTrial = guess => {
    const trials = this.state.trials.slice();
    trials[trials.length - 1].guess = guess;

    let type = this.state.order[trials.length - 1];
    let points = gen_data(DATAPOINT_COUNTS[type]);
    let markedIndices = indices_to_compare(DATAPOINT_COUNTS[type]);
    let { high, low } = this.getHighLow(points, markedIndices)

    trials.push({
      guess: null,
      high: high,
      low: low,
      type: type,
      markedIndices: markedIndices,
      points: points,
    });
    this.setState({
      trials: trials,
    })
    if (trials.length === 16) {
      this.uploadToFirebase(guess);
      this.setPage(PAGES.thanks);
    }
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
          high={this.state.trials[this.state.trials.length - 1].high}
          low={this.state.trials[this.state.trials.length - 1].low}
          type={this.state.trials[this.state.trials.length - 1].type}
          markedIndices={this.state.trials[this.state.trials.length - 1].markedIndices}
          points={this.state.trials[this.state.trials.length - 1].points}
          nextTrial={this.nextTrial}
          key={this.state.trials.length - 1}
        />
      </div>
    )
  }
}

class Survey extends Component {
  constructor(props) {
    document.title = "Background Survey"
    super(props);
    this.state = {
      familiarity: 'No Formal Education',
      education: 'No Formal Stats Training',
      stats: 'Not familiar',
      field: ''
    }
  }

  handleChangeFamiliarity = e => {
    this.setState({
      familiarity: e.target.value,
    })
  }

  handleChangeEducation = e => {
    this.setState({
      education: e.target.value,
    })
  }

  handleChangeStats = e => {
    this.setState({
      stats: e.target.value,
    })
  }

  handleChangeField = e => {
    this.setState({
      field: e.target.value,
    })
  }

  fieldIsValid = () => {
    return this.state.field !== "" && this.state.field !== undefined;
  }

  render() {
    return (
      <div>
        <h2>Background Survey</h2>
        <form>
          <label>
            What is the highest education level you are currently pursuing or have achieved?
          <select value={this.state.education} onChange={this.handleChangeEducation}>
              <option value="No Formal Education">
                No Formal Education
            </option>
              <option value="High School">
                High School
            </option>
              <option value="Bacherlors Degree (BA)">
                Bachelors Degree (BA)
            </option>
              <option value="Bachelors Degree (BS)">
                Bachelors Degree (BS)
            </option>
              <option value="Vocational Training">
                Vocational Training
            </option>
              <option value="Masters Degree">
                Masters Degree
            </option>
              <option value="PhD/Doctorate">
                PhD/Doctorate
            </option>
            </select>
          </label>
          <label>
            How familiar are you with statistics?
          <select value={this.state.stats} onChange={this.handleChangeStats}>
              <option value="No Formal Stats Training">
                No Formal Stats Training
            </option>
              <option value="Some Basic Statistics Training">
                Some Basic Statistics Training
            </option>
              <option value="A lot of statistics experience">
                A lot of statistics experience
            </option>
              <option value="I use statistics everyday">
                I use statistics everyday
            </option>
            </select>
          </label>
          <label>
            How familiar would you say you are with data visualizations?
          <select value={this.state.familiarity} onChange={this.handleChangeFamiliarity}>
              <option value="Not familiar">
                Not familiar
            </option>
              <option value="Passing Knowledge">
                Passing Knowledge
            </option>
              <option value="Knowledgable">
                Knowledgable
            </option>
              <option value="Expert">
                Expert
            </option>
            </select>
          </label>
          <label>
            What is your area of study or field you work in?
          <input type="text" onChange={this.handleChangeField}></input>
          </label>
          <button type="submit" className="button" onClick={() => this.props.handleSurvey(this.state)} disabled={!this.fieldIsValid()}>Submit</button>
        </form>
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
      this.props.nextTrial(this.state.guess)
    }
  }

  guessIsValid = () => {
    return this.state.guess && (0 < this.state.guess && this.state.guess <= 1);
  }

  componentDidMount() {
    fillChart(this.props.type, this.props.points, this.props.markedIndices);
  }

  renderError() {
    // return this.guessIsValid() ? null : <p>Please enter a valid guess before continuing.</p>
    return null;
  }

  render() {
    return (
      <div className="vis-form">
        {renderChartTarget()}
        {/* <p>True Value: {this.props.low / this.props.high}</p> */}
        <p>What percentage of the larger section is the smaller section?</p>
        <p>(Answer as a decimal Example if the small section is 50% the size of the large section, you would answer 0.5)</p>
        <form>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            onChange={this.handleChange}
          ></input>
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
