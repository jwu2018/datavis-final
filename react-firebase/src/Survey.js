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

export { Survey }