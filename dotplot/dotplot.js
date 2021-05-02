
const numberOfQuantileDots = 100;

const quantilePercent = 0.15;

const average = 11.4;

const standardDeviation = 0.4;

// const domain = average - 10 > 0? [0, average*2] : [average/2, average*2];


let vegaSpecification = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "A quantile dot plot conveying the uncertainty of weather.",
    "width": 400,
    "height": 200,
    "padding": 5,
  
    "signals": [
      {
        "name": "quantiles", "value": numberOfQuantileDots
      },
      {"name": "mean", "update": "log("+average+")"},
      {"name": "sd", "value": standardDeviation},
      {"name": "step", "update": "1.25 * sqrt("+numberOfQuantileDots+" / quantiles)"},
      {"name": "size", "update": "scale('x', step) - scale('x', 0)"},
      {"name": "area", "update": "size * size"},
      {
        "name": "select", "init": "quantileLogNormal("+quantilePercent+", mean, sd)"
      }
    ],
  
    "data": [
      {
        "name": "quantiles",
        "transform": [
          {
            "type": "sequence", "as": "p",
            "start": {"signal": "0.5 / quantiles"},
            "step": {"signal": "1 / quantiles"},
            "stop": 1
          },
          {
            "type": "formula", "as": "value",
            "expr": "quantileLogNormal(datum.p, mean, sd)"
          },
          {
            "type": "dotbin",
            "field": "value",
            "step": {"signal": "step"}
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
  
    "scales": [
      {
        "name": "x",
        "domain": [0, 30],
        "range": "width"
      },
      {
        "name": "y",
        "domain": {"signal": "[0, height / size]"},
        "range": "height"
      }
    ],
  
    "axes": [
      {"scale": "x", "orient": "bottom"}
    ],
  
    "marks": [
      {
        "type": "symbol",
        "from": {"data": "quantiles"},
        "encode": {
          "enter": {
            "x": {"scale": "x", "field": "bin"},
            "y": {"scale": "y", "signal": "datum.y0 + 0.5"},
            "size": {"signal": "area"}
          },
          "update": {
            "fill": {"signal": "datum.bin < select ? 'red' : 'blue'"}
          }
        }
      }
    ]
  }

vegaEmbed(
    '#view',
    vegaSpecification
);