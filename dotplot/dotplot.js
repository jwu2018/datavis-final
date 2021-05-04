handleDotPlots();

// Stops dot plot interval and clear any created elements
// Needs to be called after the dot plots are done
function stopDotPlots() {
  document.getElementById("target").innerHTML = "";
}

// Function to call to handle all of the quantile dot plot stuff
function handleDotPlots() {
  // Set up the needed HTMl
  handleDotPlotHTML();

  //Generate the data
  let d = generate_hourly_data();
  let rainProbabilities = d[1];
  let rainAmount = d[0];

  // Counter for hour of the day
  let i = 0;

  // Animate the graphs
  let interval = setInterval(generatePlots, 1000);

  // Generate both plots and the title
  function generatePlots() {
    // If the dot plots are gone, stop
    if (document.getElementById("amountview") === null) {
      clearInterval(interval);
      return;
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
  let theSelector = document.getElementById("dotplotselection");
  theSelector.addEventListener("change", function () {
    let selectedValue = parseInt(theSelector.value);
    // If it's the animate, animate
    if (selectedValue === 25) {
      //i = 0;
      interval = setInterval(generatePlots, 1000);
    } else { // Otherwise load the plot for that hour
      clearInterval(interval);
      i = selectedValue;
      MakeTitle();
      createQuantileDotPlotAmount(selectedValue);
      createQuantileDotPlotProbability(selectedValue);
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
              "fill": { "value": "blue" }
            },
          }
        }
      ]
    }

    // Put the vega lite chart in the HTML
    vegaEmbed(
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
              "fill": { "value": "steelblue" }
            },
          }
        }
      ]
    }

    // Put the vega-lite chart in the HTML
    vegaEmbed(
      '#amountview',
      vegaSpecification
    );
  }
}

// A helper to handle setting up any HTML stuff
function handleDotPlotHTML() {
  // Create the needed HTML elements
  let probabilityView = document.createElement("div");
  let amountView = document.createElement("div");
  let chartTitleHolder = document.createElement("div");
  let chartTitle = document.createElement("p");
  let selector = createSelect();

  probabilityView.id = "probabilityview";
  probabilityView.style = "height: min-content;"
  amountView.id = "amountview";
  amountView.style = "height: min-content;"
  chartTitle.id = "charttitle";
  chartTitle.style = "margin: 0 10 0 0"
  chartTitleHolder.style = "display: flex";

  // Add the needed elements to the DOM
  const targetElementId = "target";

  chartTitleHolder.appendChild(chartTitle);
  chartTitleHolder.appendChild(selector);
  document.getElementById(targetElementId).appendChild(chartTitleHolder);
  document.getElementById(targetElementId).appendChild(probabilityView);
  document.getElementById(targetElementId).appendChild(amountView);
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
