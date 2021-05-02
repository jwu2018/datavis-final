/**------------------------------------------------------------------------------------------
 * ?                                         ABOUT
 * @author         :  Imogen Cleaver-Stigum, Andrew Nolan, Matt St. Louis, Jyalu Wu
 * @repo           :  https://github.com/jwu2018/datavis-final
 * @createdOn      :  May 1, 2021
 * @description    :  Hypothetical outcome plots using javascript and vega
 * @sources        :  https://vega.github.io/vega-lite/tutorials/getting_started.html#embed
 *                    https://vega.github.io/vega/examples/hypothetical-outcome-plots/
 *------------------------------------------------------------------------------------------**/


/**------------------------------------------------------------------------
 *                       Specs to Build HOP in Vega
 *------------------------------------------------------------------------**/
var vegaSpec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "A hypothetical outcome plot that uses animated samples to convey uncertainty.",
    "width": 600,
    "height": 400,
  
    "signals": [
      { "name": "baseline", "value": 5 },
      // TODO get rid of noise slider
      {
        "name": "noise", "value": 2,
        "bind": {"input": "range", "min": 0, "max": 4, "step": 0.1}
      },
      // TODO get rid of trend slider
      {
        "name": "trend", "value": 0,
        "bind": {"input": "range", "min": -1, "max": 1, "step": 0.1}
      },
      {
        "name": "sample", "value": 1,
        "on": [
          {
            "events": "timer{1000}",
            "update": "1 + ((sample + 1) % 3)"
          }
        ]
      }
    ],
  
    // TODO update with weather data
    "data": [
      {
        "name": "steps",
        "transform": [
          {
            "type": "sequence",
            "start": 0, "stop": 12, "step": 1
          },
          {
            "type": "formula", "as": "month",
            "expr": "timeFormat(datetime(2015, datum.data, 1), '%b')"
          },
          {
            "type": "formula", "as": "value",
            "expr": "clamp(sample && (baseline - 0.5 * trend * (5.5 - datum.data) + noise * (2 * random() - 1)), 0, 10)"
          }
        ]
      }
    ],
  
    "scales": [
      {
        "name": "xscale", "type": "band",
        "domain": {"data": "steps", "field": "month"},
        "range": "width"
      },
      {
        "name": "yscale", "type": "linear",
        "domain": [0, 10],
        "range": "height"
      }
    ],
  
    "axes": [
      {"orient": "left", "scale": "yscale"},
      {"orient": "bottom", "scale": "xscale"}
    ],
  
    "marks": [
      {
        "type": "rect",
        "from": {"data": "steps"},
        "encode":{
          "enter": {
            "x": {"scale": "xscale", "field": "month"},
            "width": {"scale": "xscale", "band": 1, "offset": -1},
            "fill": {"value": "steelblue"}
          },
          "update": {
            "y": {"scale": "yscale", "field": "value"},
            "y2": {"scale": "yscale", "value": 0}
          }
        }
      }
    ]
};


/**------------------------------------------------------------------------
 *                           Specs for Embedding Vega
 *------------------------------------------------------------------------**/
var embedSpec = {
mode: "vega",  // Instruct Vega-Embed to use the Vega compiler
spec: vegaSpec
};


/**------------------------------------------------------------------------
 *                         Embed Vega into the Website
 *------------------------------------------------------------------------**/
vegaEmbed('#vis', vegaSpec);