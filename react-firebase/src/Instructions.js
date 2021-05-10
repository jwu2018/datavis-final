
import React, { Component } from 'react';
import bars from './images/bars.png'
import hop from './images/hop.png'
import dots from './images/dots.png'

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

function TextHelp(props) {
    return (
        <div>
            <h3>How to Interpret the Text</h3>
            <p>This text describes the precipitation forecast for tomorrow afternoon. <br/><br/>
            The following describes the chance of precipitation for tomorrow:<br/>
            - At 5:00 pm, there is a 30% chance of moderate precipitation.<br/>
            - At 6:00 pm, there is a 15% chance of light precipitation.<br/>
            - At 7:00 pm, there is a 30% chance of moderate precipitation.<br/>
            - At 8:00 pm, there is a 30% chance of moderate precipitation.<br/>
            - At 9:00 pm, there is no chance of precipitation.
            </p>
        </div>
    )
}

function BarHelp(props) {
    return (
        <div>
            <h3>How to Read the Bar Plot</h3>
            <p>These bar plots show the precipitation forecast for tomorrow. The y-axis is the predicted rate of precipitation (e.g. 0.2 in/hr) and the x-axis is the time (e.g. 1PM). Each bar represents a different hour and is colored based on the amount of precipitation (light, moderate, or heavy).</p>
            <img src={bars} alt="The weather bar chart"></img>
        </div>
    )
}

function HOPHelp(props) {
    return (
        <div>
            <h3>How to Read the Hypothetical Outcome Plot</h3>
            <p>Hypothetical outcome plots (HOPs) are like bar plots but upgraded. They are animated to show many hypothetical predictions of how much rain you might get based on the chances of precipitation for each hour. Each second of the animation shows a different hypothetical prediction of tomorrow’s weather forecast.</p>
            <p>Like the bar plots, HOPs have a different bar for each hour and are colored based on the amount of precipitation.</p>
            <img src={hop} alt="The hypothetical outcome plot"></img>
        </div>
    )
}

function DotHelp(props) {
    return (
        <div>
            <h3>How to Read the Quantile Dot Plot</h3>
            <p>These dot plots describe the precipitation forecast for tomorrow afternoon. The left plot shows the probability distribution for chance of rain, and the right plot shows the probability distribution for amount of rain. The plots are iterating through each hour of the afternoon (1pm, 2pm, 3pm, etc) to show how the predictions change over the course of the afternoon.</p>
            <p>The dropdown menu allows you to choose a particular time of day to get a closer look at the forecast for that time of day.</p>
            <img src={dots} alt="The quantile dot plot"></img>
        </div>
    )
}

function Help(props) {
    let display = null;

    switch (props.type) {
        case CHARTS.text:
            display = <TextHelp/>
            break;
        case CHARTS.bar:
            display = <BarHelp/>
            break;
        case CHARTS.hop:
            display = <HOPHelp/>
            break;
        case CHARTS.dot:
            display = <DotHelp/>
            break;
    }

    return (
        <div>
            {display}
            <p><strong>Please answer the question based on the data below, and not the example above.</strong></p>
        </div>
    )
}

function Instructions(props) {
    document.title = "Instructions"
    return (
      <div>
        <h2>Instructions</h2>
        <p>Here we describe the key terms and visualizations you will see in this survey:</p>
        <h3>Probability of Precipitation</h3>
        <p>The probability of precipitation is a percent value (10%, 100%, etc) that represents the chance that precipitation will occur. For example, a 10% probability of precipitation means that there is a 10% chance of any amount of rain happening, and a 90% chance of no rain at all. </p>
        <h3>Amount of Precipitation</h3>
        <p>The amount of precipitation is always in units of inches per hour. </p>
        <ul>
          <li>Up to 0.1 inches per hour is “light precipitation”</li>
          <li>0.1-0.3 inches per hour is “moderate precipitation”</li>
          <li>0.3 or more inches per hour is “heavy precipitation”</li>
        </ul>
        <TextHelp/>
        <BarHelp/>
        <HOPHelp/>
        <DotHelp/>
        <br></br><br></br>
        <p>Make sure you read these descriptions carefully, as we will now ask you questions based on these visualizations.</p>
        <button type="button" className="button" onClick={() => props.setPage(PAGES.survey)}>
          I'm ready to go!
        </button>
      </div>
    )
  }

//   function Instructions(props) {
//     document.title = "Instructions"
//     return (
//       <div>
//         <h2>Instructions</h2>
//         <p>Here we describe key terms and visualizations you will see in this survey:</p>
//         <h3>Probability of Precipitation</h3>
//         <p>The probability of precipitation is a percent value (10%, 100%, etc) that represents the chance that precipitation will occur. For example, a 10% probability of precipitation means that there is a 10% chance of any amount of rain happening, and a 90% chance of no rain at all. </p>
//         <h3>Amount of Precipitation</h3>
//         <p>The amount of precipitation is always in units of inches per hour. </p>
//         <ul>
//           <li>Up to 0.1 inches per hour is “light precipitation”</li>
//           <li>0.1-0.3 inches per hour is “moderate precipitation”</li>
//           <li>0.3 or more inches per hour is “heavy precipitation”</li>
//         </ul>
//         <h3>Text</h3>
//         <p>This text describes the precipitation forecast for tomorrow afternoon. <br/><br/>
//           The following describes the chance of precipitation for tomorrow:<br/>
//           - At 5:00 pm, there is a 30% chance of moderate precipitation.<br/>
//           - At 6:00 pm, there is a 15% chance of light precipitation.<br/>
//           - At 7:00 pm, there is a 30% chance of moderate precipitation.<br/>
//           - At 8:00 pm, there is a 30% chance of moderate precipitation.<br/>
//           - At 9:00 pm, there is no chance of precipitation.
//         </p>
//         <h3>Bar Plot</h3>
//         <p>These bar plots show the precipitation forecast for tomorrow. The y-axis is the predicted rate of precipitation (e.g. 0.2 in/hr) and the x-axis is the time (e.g. 1PM). Each bar represents a different hour and is colored based on the amount of precipitation (light, moderate, or heavy).</p>
//         <img src={bars} alt="The weather bar chart"></img>
//         <h3>Hypothetical Outcome Plot</h3>
//         <p>Hypothetical outcome plots (HOPs) are like bar plots but upgraded. They are animated to show many hypothetical predictions of how much rain you might get based on the chances of precipitation for each hour. Each second of the animation shows a different hypothetical prediction of tomorrow’s weather forecast.</p>
//         <p>Like the bar plots, HOPs have a different bar for each hour and are colored based on the amount of precipitation.</p>
//         <img src={hop} alt="The hypothetical outcome plot"></img>
//         <h3>Quantile Dot Plot</h3>
//         <p>These dot plots describe the precipitation forecast for tomorrow afternoon. The plots are iterating through each hour of the afternoon (1pm, 2pm, 3pm, etc) to show how the predictions change over the course of the afternoon.</p>
//         <p>The dropdown menu allows you to choose a particular time of day to get a closer look at the forecast for that time of day.</p>
//         <img src={dots} alt="The quantile dot plot"></img>
//         <br></br><br></br>
//         <button type="button" className="button" onClick={() => props.setPage(PAGES.survey)}>
//           I'm ready to go!
//         </button>
//       </div>
//     )
//   }

export { Help, Instructions }