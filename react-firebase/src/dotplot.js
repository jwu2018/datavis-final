import * as vega from 'vega';
import * as vegaLite from 'vega-lite';
import embed from 'vega-embed';

let interval;

// Stops dot plot interval and clear any created elements
// Needs to be called after the dot plots are done
function stopDotPlots() {
  document.getElementById("svgcontainer").innerHTML = "";
}

// Function to call to handle all of the quantile dot plot stuff
function handleDotPlots(d) {
  // Clear it if for some reason it didn't
  clearInterval(interval);
  stopDotPlots();

  // Set up the needed HTMl
  handleDotPlotHTML();

  //Generate the data
  // let d = generate_hourly_data();
  let rainProbabilities = d[1];
  let rainAmount = d[0];

  // Counter for hour of the day
  let i = 0;

  // Animate the graphs
  interval = setInterval(generatePlots, 1000);

  let color = "steelblue";

  // Generate both plots and the title
  function generatePlots() {
    // If the dot plots are gone, stop
    if (document.getElementById("amountview") === null) {
      clearInterval(interval);
      return;
    }

    // Choose the colors
    if(rainAmount[i] < 0.2){
      color = "lightcyan";
    }else if(rainAmount[i] < 0.4){
      color = "deepskyblue";
    }else{
      color = "steelblue";
    }


    MakeTitle();

    // Create the plots
    createQuantileDotPlotAmount(i);
    createQuantileDotPlotProbability(i);

    // Increment the hour
    i++;
    if (i === 24) {
      i = 0;
      //stopDotPlots();
    }
  }

  // Makes the title of the plot
  function MakeTitle() {
    // Figure out the time for the title
    const hour = i % 12 === 0 ? "12" : (i % 12).toString()
    const ampm = i >= 12 ? "pm" : "am"
    const timeHour = hour + " " + ampm;
    document.getElementById("charttitle").innerHTML = "<strong>Chance of rain at " + timeHour + "</strong>";
  }

  // Handle chaning the selected value
  let isAnimating = true;
  let theSelector = document.getElementById("dotplotselection");
  let theAnimationSelector = document.getElementById("animateSpeed");
  theSelector.addEventListener("change", function () {
    let selectedValue = parseInt(theSelector.value);
    // If it's the animate, animate
    if (selectedValue === 25) {
      //i = 0;
      isAnimating = true;
      theAnimationSelector.style.display = "block"
      interval = setInterval(generatePlots, theAnimationSelector.value);
    } else { // Otherwise load the plot for that hour
      clearInterval(interval);
      isAnimating = false;
      theAnimationSelector.style.display = "none"
      i = selectedValue;
      MakeTitle();
      createQuantileDotPlotAmount(selectedValue);
      createQuantileDotPlotProbability(selectedValue);
    }
  });

  // Handle the animation speed
  theAnimationSelector.addEventListener("change", function(){
    if(isAnimating){
      clearInterval(interval);
      interval = setInterval(generatePlots, theAnimationSelector.value);
    }
  });

  // Creates the dot plot
  function createQuantileDotPlotProbability(i) {
    // Number of dots to draw
    const numberOfQuantileDots = 1000;

    // The average of the distribution (the probability of rain)
    const average = rainProbabilities[i] * 100;

    // The standard deviation (this keeps an even spread)
    const standardDeviation = 1 - rainProbabilities[i];

    // The vega specification 
    let vegaSpecification = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "A quantile dot plot conveying the uncertainty of weather.",
      // Size of the canvas
      "width": 400,
      "height": 300,
      "padding": 5,

      // Math stuff (thanks Vega tutorials/documentation)
      "signals": [
        {
          "name": "quantiles", "value": numberOfQuantileDots
        },
        { "name": "mean", "update": "log(" + average + ")" },
        { "name": "sd", "value": standardDeviation },
        { "name": "step", "update": "1.25 * sqrt(" + numberOfQuantileDots + " / quantiles)" },
        { "name": "size", "update": "scale('x', step) - scale('x', 0)" },
        { "name": "area", "update": "size * size" }
      ],

      // Create the dot data from the hourly data
      "data": [
        {
          "name": "quantiles",
          "transform": [
            {
              "type": "sequence", "as": "p",
              "start": { "signal": "0.5 / quantiles" },
              "step": { "signal": "1 / quantiles" },
              "stop": 1
            },
            {
              "type": "formula", "as": "value",
              "expr": "quantileLogNormal(datum.p, mean, sd)"
            },
            {
              "type": "dotbin",
              "field": "value",
              "step": { "signal": "step" }
            },
            {
              "type": "stack",
              "groupby": ["bin"]
            },
            {
              "type": "extent",
              "field": "y1",
              "signal": "ext"
            }
          ]
        }
      ],

      // The axes scales
      "scales": [
        {
          "name": "x",
          "domain": [0, 100],
          "range": "width"
        },
        {
          "name": "y",
          "domain": { "signal": "[0, height / size]" },
          "range": "height"
        }
      ],

      // Draw the x axis
      "axes": [
        { "scale": "x", "orient": "bottom", "title": "Probability of Precipitation (Percentage Chance)" }
      ],

      // Draw the dots
      "marks": [
        {
          "type": "symbol",
          "from": { "data": "quantiles" },
          "clip": true,
          "encode": {
            "enter": {
              "x": { "scale": "x", "field": "bin" },
              "y": { "scale": "y", "signal": "datum.y0 + 0.5" },
              "size": { "signal": "area" },
              "fill": { "value": color },
              "stroke": {"value":"black"},
              "strokeWidth":{"value":"0.1"}
            },
          }
        }
      ]
    }

    // Put the vega lite chart in the HTML
    embed(
      '#probabilityview',
      vegaSpecification
    );
  }

  // Create the dot plot for the amount of rain
  function createQuantileDotPlotAmount(i) {
    // The number of dots
    const numberOfQuantileDots = 1000;

    // The average expected rain fall (from the generated data)
    const average = rainAmount[i] * 100;

    // The standard deviation (this map keeps the curves nice)
    const standardDeviation = 1 - rainAmount[i];

    // The vega-lite specification
    let vegaSpecification = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "A quantile dot plot conveying the uncertainty of weather.",
      // The size of the Canvas
      "width": 400,
      "height": 300,
      "padding": 5,

      // Math stuff
      "signals": [
        {
          "name": "quantiles", "value": numberOfQuantileDots
        },
        { "name": "mean", "update": "log(" + average + ")" },
        { "name": "sd", "value": standardDeviation },
        { "name": "step", "update": "1.25 * sqrt(" + numberOfQuantileDots + " / quantiles)" },
        { "name": "size", "update": "(scale('x', step) - scale('x', 0))" },
        { "name": "area", "update": "size * size" }
      ],

      // Generate the dot data from the specific hour's data
      "data": [
        {
          "name": "quantiles",
          "transform": [
            {
              "type": "sequence", "as": "p",
              "start": { "signal": "0.5 / quantiles" },
              "step": { "signal": "1 / quantiles" },
              "stop": 1
            },
            {
              "type": "formula", "as": "value",
              "expr": "quantileLogNormal(datum.p, mean, sd)"
            },
            {
              "type": "dotbin",
              "field": "value",
              "step": { "signal": "step" }
            },
            {
              "type": "stack",
              "groupby": ["bin"]
            },
            {
              "type": "extent",
              "field": "y1",
              "signal": "ext"
            }
          ]
        }
      ],

      // The axes scales
      "scales": [
        {
          "name": "x",
          "domain": [0, 100],
          "range": "width"
        },
        {
          "name": "y",
          "domain": { "signal": "[0, height / size]" },
          "range": "height"
        }
      ],

      // Draw the x-axis
      // Scale it to be the correct size
      "axes": [
        {
          "scale": "x",
          "orient": "bottom",
          "title": "Amount of Precipitation (Inches)",
          "encode": {
            "labels": {
              "update": {
                "text": { "signal": "datum.value/100" }
              }
            }
          }
        }
      ],

      // Draw the dots
      "marks": [
        {
          "type": "symbol",
          "from": { "data": "quantiles" },
          "clip": true,
          "encode": {
            "enter": {
              "x": { "scale": "x", "field": "bin" },
              "y": { "scale": "y", "signal": "datum.y0 + 0.5" },
              "size": { "signal": "area" },
              "fill": { "value": color },
              "stroke": {"value":"black"},
              "strokeWidth":{"value":"0.1"}
            },
          }
        }
      ]
    }

    // Put the vega-lite chart in the HTML
    embed(
      '#amountview',
      vegaSpecification
    );
  }
}

// A helper to handle setting up any HTML stuff
function handleDotPlotHTML() {
  // Create the needed HTML elements
  let viewDiv = document.createElement("div");
  let probabilityView = document.createElement("div");
  let amountView = document.createElement("div");
  let chartTitleHolder = document.createElement("div");
  let chartTitle = document.createElement("p");
  let selector = createSelect();
  let secondSelector = createSecondSelect();

  probabilityView.id = "probabilityview";
  probabilityView.style = "height: min-content;"
  amountView.id = "amountview";
  amountView.style = "height: min-content;"
  chartTitle.id = "charttitle";
  chartTitle.style = "margin-right: 10px"
  selector.style = "margin-right: 10px; width:auto"
  secondSelector.style = "width:auto"
  chartTitleHolder.style = "display: flex";
  viewDiv.style = "display: flex";

  // Add the needed elements to the DOM
  const targetElementId = "svgcontainer";

  if (document.getElementById(targetElementId)) {
    chartTitleHolder.appendChild(chartTitle);
    chartTitleHolder.appendChild(selector);
    chartTitleHolder.appendChild(secondSelector);
    document.getElementById(targetElementId).appendChild(chartTitleHolder);
    viewDiv.appendChild(probabilityView);
    viewDiv.appendChild(amountView);
    document.getElementById(targetElementId).appendChild(viewDiv);
  }
}

// A helper function to build the select
function createSelect() {
  let selector = document.createElement("select");
  selector.id = "dotplotselection";
  let firstOption = document.createElement("option");
  firstOption.value = 25;
  firstOption.innerText = "Animate";
  selector.appendChild(firstOption);
  for (let i = 0; i < 24; i++) {
    let option = document.createElement("option");
    option.value = i;
    const hour = i % 12 === 0 ? "12" : (i % 12).toString()
    const ampm = i >= 12 ? "pm" : "am"
    const timeHour = hour + " " + ampm;
    option.innerText = timeHour;
    selector.appendChild(option);
  }
  return selector;
}

function createSecondSelect(){
  let selector = document.createElement("select");
  selector.id = "animateSpeed";
  let option = document.createElement("option");
  option.value = 1000;
  option.innerText = "1 second";
  selector.appendChild(option);
  option = document.createElement("option");
  option.value = 2000;
  option.innerText = "2 seconds";
  selector.appendChild(option);
  option = document.createElement("option");
  option.value = 5000;
  option.innerText = "5 seconds";
  selector.appendChild(option);
  option = document.createElement("option");
  option.value = 10;
  option.innerText = "Really Fast";
  selector.appendChild(option);

  return selector;
}

export { handleDotPlots, stopDotPlots }