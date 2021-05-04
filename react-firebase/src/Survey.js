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

class Survey extends Component {
    constructor(props) {
      document.title = "Background Survey"
      super(props);
      this.state = {
        frequency: 'More than once per day',
        app: '',
        experience: 'Very unfavorable',
        inaccurate: 'Very often',
        Reliable: 'Very reliable',
        stats: ''
      }
    }
  
    handleChangeFrequency = e => {
      this.setState({
        frequency: e.target.value,
      })
    }

    handleChangeApp = e => {
      this.setState({
        app: e.target.value,
      })
    }
  
    handleChangeExperience = e => {
      this.setState({
        experience: e.target.value,
      })
    }

    handleChangeInaccurate = e => {
      this.setState({
        inaccurate: e.target.value,
      })
    }

    handleChangeReliable = e => {
      this.setState({
        reliable: e.target.value,
      })
    }

    handleChangeStats = e => {
      this.setState({
        stats: e.target.value,
      })
    }
  
    inputIsValid = () => {
      return this.state.app !== "" && this.state.app !== undefined && this.state.stats !== "" && this.state.stats !== undefined;
    }
  
    render() {
      return (
        <div>
          <h2>Background Survey</h2>
          <form>
            <label>
              How frequently do you use a weather app?
            <select value={this.state.frequency} onChange={this.handleChangeFrequency}>
                <option value="More than once per day">
                  More than once per day
              </option>
                <option value="Daily">
                  Daily
              </option>
                <option value="Almost daily">
                  Almost Daily
              </option>
                <option value="Sometimes">
                  Sometimes
              </option>
                <option value="Never">
                  Never
              </option>
              </select>
            </label>
            <label>
              Which weather app do you use?
            <input type="text" onChange={this.handleChangeApp}></input>
            </label>
            <label>
              How would you characterize your experience with this app?
            <select value={this.state.experience} onChange={this.handleChangeExperience}>
                <option value="Very unfavorable">
                  Very unfavorable
              </option>
                <option value="Unfavorable">
                  Unfavorable
              </option>
                <option value="Neutral">
                  Neutral
              </option>
                <option value="Favorable">
                  Favorable
              </option>
                <option value="Very favorable">
                  Very Favorable
              </option>
              </select>
            </label>
            <label>
              How often have you observed this app to report information you feel to be inaccurate?
            <select value={this.state.inaccurate} onChange={this.handleChangeInaccurate}>
                <option value="Very often">
                  Very Often
              </option>
                <option value="Often">
                  Often
              </option>
                <option value="Sometimes">
                  Sometimes
              </option>
                <option value="Not very often">
                  Not Very Often
              </option>
                <option value="Never">
                  Never
              </option>
              </select>
            </label>
            <label>
              How reliable do you find this app?
            <select value={this.state.reliable} onChange={this.handleChangeReliable}>
                <option value="Very reliable">
                  Very Reliable
              </option>
                <option value="Somewhat reliable">
                  Somewhat Reliable
              </option>
                <option value="Neutral">
                  Neutral
              </option>
                <option value="Not very reliable">
                  Not very Reliable
              </option>
                <option value="Never reliable">
                  Never Reliable
              </option>
              </select>
            </label>
            <label>
              Describe your experience with statistics and/or data visualization?
            <input type="text" onChange={this.handleChangeStats}></input>
            </label>
            <button type="submit" className="button" onClick={() => this.props.handleSurvey(this.state)} disabled={!this.inputIsValid()}>Submit</button>
          </form>
        </div>
      )
    }
  }

export { Survey }