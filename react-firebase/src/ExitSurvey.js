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
  ExitSurvey: 'ExitSurvey',
  thanks: 'Thanks'
}

const TRIALS = [
  CHARTS.bar, CHARTS.bar, CHARTS.bar, CHARTS.bar, CHARTS.bar,
  CHARTS.pie, CHARTS.pie, CHARTS.pie, CHARTS.pie, CHARTS.pie,
  CHARTS.spiral, CHARTS.spiral, CHARTS.spiral, CHARTS.spiral, CHARTS.spiral,
]

class ExitSurvey extends Component {
    constructor(props) {
      document.title = "Exit Survey"
      super(props);
      this.state = {
        Rank1: 'Text',
        Rank2: 'Text',
        Rank3: 'Text',
        Rank4: 'Text',
        EffortText: '',
        EffortBar: '',
        EffortHOP: '',
        EffortDot: '',
        Feedback: ''
      }
    }
  
    handleChangeRank1 = e => {
      this.setState({
        Rank1: e.target.value,
      })
    }

    handleChangeRank2 = e => {
      this.setState({
        Rank2: e.target.value,
      })
    }

    handleChangeRank3 = e => {
      this.setState({
        Rank3: e.target.value,
      })
    }

    handleChangeRank4 = e => {
      this.setState({
        Rank4: e.target.value,
      })
    }

    handleChangeEffortText = e => {
      this.setState({
        EffortText: e.target.value,
      })
    }
  
    handleChangeEffortBar = e => {
      this.setState({
        EffortBar: e.target.value,
      })
    }

    handleChangeEffortHop = e => {
      this.setState({
        EffortHOP: e.target.value,
      })
    }

    handleChangeEffortDot = e => {
      this.setState({
        EffortDot: e.target.value,
      })
    }

    handleChangeFeedback = e => {
      this.setState({
        Feedback: e.target.value,
      })
    }
  
    rankIsValid = () => {
      return this.state.Rank1 !== this.state.Rank2 && this.state.Rank1 !== this.state.Rank3 && this.state.Rank1 !== this.state.Rank4 && this.state.Rank2 !== this.state.Rank3 & this.state.Rank2 !== this.state.Rank4 && this.state.Rank3 !== this.state.Rank4;
    }
  
    render() {
      return (
        <div>
          <h2>Exit Survey</h2>
          <form>
            <label>
              How difficult was it to read the text based description?
              <select value={this.state.EffortText} onChange={this.handleChangeEffortText}>
                <option value="Very unfavorable">
                  Very difficult
                </option>
                <option value="Unfavorable">
                    A little difficult
                </option>
                 <option value="Neutral">
                    Normal effort
                </option>
                  <option value="Favorable">
                    Kind of easy
                </option>
                 <option value="Very favorable">
                    Very easy
                </option>
              </select>
            </label>
            <label>
              How difficult was it to read the bar charts?
              <select value={this.state.EffortBar} onChange={this.handleChangeEffortBar}>
                <option value="Very unfavorable">
                  Very difficult
                </option>
                <option value="Unfavorable">
                    A little difficult
                </option>
                 <option value="Neutral">
                    Normal effort
                </option>
                  <option value="Favorable">
                    Kind of easy
                </option>
                 <option value="Very favorable">
                    Very easy
                </option>
              </select>
            </label>
            <label>
              How difficult was it to read the Hypothetical Outcome plots?
              <select value={this.state.EffortHOP} onChange={this.handleChangeEffortHop}>
                <option value="Very unfavorable">
                  Very difficult
                </option>
                <option value="Unfavorable">
                    A little difficult
                </option>
                 <option value="Neutral">
                    Normal effort
                </option>
                  <option value="Favorable">
                    Kind of easy
                </option>
                 <option value="Very favorable">
                    Very easy
                </option>
              </select>
            </label>
            <label>
              How difficult was it to read the Quantile Dot plots?
              <select value={this.state.EffortDot} onChange={this.handleChangeEffortDot}>
                <option value="Very unfavorable">
                  Very difficult
                </option>
                <option value="Unfavorable">
                    A little difficult
                </option>
                 <option value="Neutral">
                    Normal effort
                </option>
                  <option value="Favorable">
                    Kind of easy
                </option>
                 <option value="Very favorable">
                    Very easy
                </option>
              </select>
            </label>
            <label>
            Rank the Vizzes according to how useful they are? (Choose each viz once)
            </label>
            <label>
              Choose the 1st most useful visualization:
            </label>
            <input type="radio" id="text1" value="Text" name="rank1" onChange={this.handleChangeRank1}></input>
            <label for="text1">Text</label>
            <input type="radio" id="Bar1" value="Bar" name="rank1"  onChange={this.handleChangeRank1}></input>
            <label for="Bar1">Bar Chart</label>
            <input type="radio" id="HOP1" value="Hop" name="rank1"  onChange={this.handleChangeRank1}></input>
            <label for="HOP1">Hypothetical Outcome Plot</label>
            <input type="radio" id="qdp1" value="QDP" name="rank1"  onChange={this.handleChangeRank1}></input>
            <label for="qdp1">Quantile Dot Plot</label>
            <label>
              Choose the 2nd most useful visualization:
            </label>
            <input type="radio" id="text2" value="Text" name="rank2"  onChange={this.handleChangeRank2}></input>
            <label for="text2">Text</label>
            <input type="radio" id="Bar2" value="Bar" name="rank2"  onChange={this.handleChangeRank2}></input>
            <label for="Bar2">Bar Chart</label>
            <input type="radio" id="HOP2" value="Hop" name="rank2"  onChange={this.handleChangeRank2}></input>
            <label for="HOP2">Hypothetical Outcome Plot</label>
            <input type="radio" id="qdp2" value="QDP" name="rank2" onChange={this.handleChangeRank2}></input>
            <label for="qdp2">Quantile Dot Plot</label>
            <label>
              Choose the 3rd most useful visualization:
            </label>
            <input type="radio" id="text3" value="Text" name="rank3" onChange={this.handleChangeRank3}></input>
            <label for="text3">Text</label>
            <input type="radio" id="Bar3" value="Bar" name="rank3" onChange={this.handleChangeRank3}></input>
            <label for="Bar3">Bar Chart</label>
            <input type="radio" id="HOP3" value="Hop" name="rank3"  onChange={this.handleChangeRank3}></input>
            <label for="HOP3">Hypothetical Outcome Plot</label>
            <input type="radio" id="qdp3" value="QDP" name="rank3"  onChange={this.handleChangeRank3}></input>
            <label for="qdp3">Quantile Dot Plot</label>
            <label>
              Choose the least useful visualization:
            </label>
            <input type="radio" id="text4" value="Text" name="rank4"  onChange={this.handleChangeRank4}></input>
            <label for="text4">Text</label>
            <input type="radio" id="Bar4" value="Bar" name="rank4" onChange={this.handleChangeRank4}></input>
            <label for="Bar4">Bar Chart</label>
            <input type="radio" id="HOP4" value="Hop" name="rank4"  onChange={this.handleChangeRank4}></input>
            <label for="HOP4">Hypothetical Outcome Plot</label>
            <input type="radio" id="qdp4" value="QDP" name="rank4" onChange={this.handleChangeRank4}></input>
            <label for="qdp4">Quantile Dot Plot</label>
            <label>
              Do you have any other feedback for us?
            <input type="text" onChange={this.handleChangeFeedback}></input>
            </label>
            <button type="submit" className="button" onClick={() => this.props.handleSurvey(this.state)} disabled={!this.rankIsValid()}>Submit</button>
          </form>
        </div>
      )
    }
  }

export { ExitSurvey }