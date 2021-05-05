import React, { Component } from 'react';
import './App.css';
import fire from './firebase';
// import { fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS } from './all-charts';
import { shuffle } from 'd3-array';
import team_members from './team-members.jpg'
import { generate_hourly_data, baseline_text } from './data-generation';

import { Survey } from './Survey';
import { ExitSurvey } from './ExitSurvey';
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
  experiment: 'Experiment',
  about: 'About',
  survey: 'Survey',
  exitSurvey: 'ExitSurvey',
  thanks: 'Thanks'
}

const QUESTION_TYPES = {
    friend: 'friend',
    alone: 'alone',
    event: 'event',
    amount: 'amount',
    probability: 'probability',
}

const COMMON_TEXTS = {
    decisionConfidence: "How confident are you in your decision?",
    literacyConfidence: "How confident are you in this answer?",
    followup: "Please briefly describe the process you used to make your decision, including how you interpreted the visualization."
}

const QUESTIONS =  {
    friend: {
        type: 'friend',
        questionText: "If you had scheduled a hike with a friend for 3pm tomorrow, and the following forecast for tomorrow was presented to you, would you reschedule?",
        confidenceText: COMMON_TEXTS.decisionConfidence,
        followupText: COMMON_TEXTS.followup,
    },
    alone: {
        type: 'alone',
        questionText: "Assuming that you enjoy taking afternoon walks and would have availability, would you plan to go outside at 3pm tomorrow, based on this information?",
        confidenceText: COMMON_TEXTS.decisionConfidence,
        followupText: COMMON_TEXTS.followup,
    },
    event: {
        type: 'event',
        questionText: "You are in charge of planning an extracurricular club event or a community event that is currently to be held outdoors. This event has been planned for a few weeks, and you have neglected to book an indoor location as a backup. The day before the event, you saw the following forecast for the day of the event. Would you pay a small fee to book the late space at the last minute in case it rains?",
        confidenceText: COMMON_TEXTS.decisionConfidence,
        followupText: COMMON_TEXTS.followup,
    },
    amount: {
        type: 'amount',
        questionText: "Based on this visualization, how much rain do you expect at 3pm tomorrow? (Answer in inches per hour)",
        confidenceText: COMMON_TEXTS.literacyConfidence,
    },
    probability: {
        type: 'probability',
        questionText: "Based on this visualization, what percent chance of rain would you expect at 3pm tomorrow?",
        confidenceText: COMMON_TEXTS.literacyConfidence,
    },
}

class Question extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    handleChangeMainAnswer = e => this.setState({MainAnswer: e.target.value})
    handleChangeConfidence = e => this.setState({Confidence: e.target.value})
    handleChangeAmount = e => this.setState({Amount: e.target.value})
    handleChangeFollowUp = e => this.setState({FollowUpText: e.target.value})

    renderAnswer() {
        switch(this.props.type) {
            case QUESTION_TYPES.friend:
            case QUESTION_TYPES.alone:
            case QUESTION_TYPES.event:
                return (
                    <div>
                        <input type="radio" id="yes-answer" value="Yes" name="main-answer" onChange={this.handleChangeMainAnswer}></input>
                        <label for="yes-answer">Yes</label>
                        <input type="radio" id="no-answer" value="No" name="main-answer"  onChange={this.handleChangeMainAnswer}></input>
                        <label for="no-answer">No</label>
                    </div>
                )
            case QUESTION_TYPES.amount:
            case QUESTION_TYPES.probability:
                return (
                    <input 
                        type="number" 
                        onChange={this.handleChangeAmount}
                        min="0"
                        max="100"
                        step="1"
                        ></input>
                )
        }
    }

    renderFollowUp() {
        switch(this.props.type) {
            case QUESTION_TYPES.friend:
            case QUESTION_TYPES.alone:
            case QUESTION_TYPES.event:
                return (
                    <label>
                        {QUESTIONS[this.props.type].followupText}
                        <br/>
                        <input type="text" onChange={this.handleChangeFollowUp}></input>
                    </label>
                )
            case QUESTION_TYPES.amount:
            case QUESTION_TYPES.probability:
                return
        }
    }

    render() {
        return (
            <div>
                <h3>Question</h3>
                <label>
                    {QUESTIONS[this.props.type].questionText}
                    {this.renderAnswer()}
                </label>
                <label>
                    {QUESTIONS[this.props.type].confidenceText}
                    <select value={this.state.EffortText} onChange={this.handleChangeConfidence}>
                        <option value="Very favorable">Very confident</option>
                        <option value="Favorable">Kind of confident</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Unfavorable">Unsure</option>
                        <option value="Very unfavorable">Very Unsure</option>
                        <option value="Void">So unsure that I would prefer not to guess</option>
                    </select>
                </label>
                {this.renderFollowUp()}

            </div>
        )
    }
}

export { Question, QUESTION_TYPES }