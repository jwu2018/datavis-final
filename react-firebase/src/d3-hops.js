/**------------------------------------------------------------------------------------------
 * ?                                         ABOUT
 * @author         :  Imogen Cleaver-Stigum, Andrew Nolan, Matt St. Louis, Jyalu Wu
 * @repo           :  https://github.com/jwu2018/datavis-final
 * @createdOn      :  May 1, 2021
 * @description    :  Bar charts using d3.js
 *------------------------------------------------------------------------------------------**/

import { generate_hourly_data } from './data-generation';
import * as d3 from 'd3';

/**------------------------------------------------------------------------
 *                           BUILDING HOPS
 *------------------------------------------------------------------------**/
const num_data_points = 24
const std_dev = 0.02 // std dev for the normal distribution

let svg, og_predictions, og_chances

const margin = {
    top: window.innerHeight / 10,
    bottom: window.innerHeight / 10,
    left: 130,
    right: window.innerWidth / 10,
    bar: window.innerWidth / 20
},
    svg_width = window.innerWidth,
    svg_height = 600 - margin.top - margin.bottom,
    graph_width = svg_width - margin.left - margin.right,
    graph_height = svg_height - margin.top - margin.bottom;


console.log('margins\ntop:', margin.top, 'bottom:', margin.bottom, 'left:', margin.left, 'right:', margin.right)
console.log('svg width:', svg_width, 'height:', svg_height)
console.log('graph width:', graph_width, 'height:', graph_height)


// timer for hypothetical outcome plot changes
let timer;

function remove_svg() {
    d3.select('#barsvg').remove()
    svg.remove()
}

function build_svg() {
    svg = d3.select("#svgcontainer")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .attr('id', 'barsvg')

    console.log('appended svg')
}

/**------------------------------------------------------------------------
 *                           Build the Bar Chart
 *------------------------------------------------------------------------**/
function build_hop(predictions) {
    let max = Math.max.apply(null, predictions)

    build_svg()

    console.log('data:', predictions)

    // append graph to svg
    let g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('id', 'barchart')

    // x and y scales
    let xScale = d3.scaleBand().range([0, graph_width]).padding(0.4),
        yScale = d3.scaleLinear().range([graph_height, 0]);

    // domains
    xScale.domain(Array(num_data_points).fill().map((element, index) => index));
    yScale.domain([0, 0.6]);

    var x_axis = d3.axisBottom()
        .scale(xScale)
        .tickValues(Array(num_data_points).fill().map((element, index) => index))
        .tickFormat(function(d){ return get_time_string(d); });

    // x scale
    g.append('g')
        .attr('transform', 'translate(0,' + (graph_height) + ')')
        .call(x_axis)
        .append('text')
        .attr('text-anchor', 'end')

    // label axis: light rain, mod, heavy
    // ['Light', 'Moderate', 'Heavy']
    svg.append('text')
        .attr('x', 0)
        .attr('y', graph_height / 3 + margin.top)
        .text('Heavy Precipitation')
        .attr('font-size', 11)
    svg.append('text')
        .attr('x', 0)
        .attr('y', 8 * graph_height / 12 + margin.top)
        .text('Moderate Precipitation')
        .attr('font-size', 11)
    svg.append('text')
        .attr('x', 0)
        .attr('y', graph_height * 11 / 12 + margin.top)
        .text('Light Precipitation')
        .attr('font-size', 11)

    // y scale
    g.append('g')
        .call(d3.axisLeft(yScale).ticks(6))
        .append('text', '')
        .attr('text-anchor', 'end')

    // Bars
    for (let i = 0; i < num_data_points; i++) {
        svg.append('rect')
            .attr('fill', color_by_category(predictions[i]))
            .attr('stroke', 'black')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.bottom + ')')
            .attr('x', xScale(i))
            .attr('y', yScale(predictions[i]))
            .attr('height', graph_height - yScale(predictions[i]))
            .attr("width", xScale.bandwidth())
    }
}

function color_by_category(prediction) {
    if (prediction < 0.1) return "lightcyan"
    if (prediction < 0.3) return "deepskyblue"
    return "steelblue"
}

/**
 * Updates the HOP every second
 */
function update_hop() {
    stopTimer()
    timer = setInterval(function () {
        remove_svg()
        build_hop(gen_hypothetical_data())
    }, 1000);
    return timer
}

/**
 * Stops the timer and thus stops the HOPs from animating
 */
function stopTimer() {
    //alert("Timer stopped");
    clearInterval(timer);
}


/**
 * Generates hypothetical data based on the predictions and chances
 * @returns An array of hypothetical predictions
 */
function gen_hypothetical_data() {
    let hypothetical_predictions = []
    let categories = []

    console.log('chances', og_chances)

    // choose what categories the hypothetical prediction should be in:
    //      close to prediction,
    //      lower than prediction, or
    //      no precipitation
    for (let i = 0; i < num_data_points; i++) {
        let category = weightedRand({
            "close to prediction": (2 * og_chances[i] / 3),
            "lower than prediction": (og_chances[i] / 3),
            "no precipitation": (1 - og_chances[i])
        });
        console.log('prediction:', og_predictions[i], '\nchance:', og_chances[i], '\ncategory for bar:\n', category)
        categories[i] = category
    }

    // generate hypothetical predictions
    for (let i = 0; i < num_data_points; i++) {
        let min = og_predictions[i] - std_dev;
        let max = og_predictions[i] + std_dev;

        switch (categories[i]) {
            case "close to prediction":
                // pick random number from min to max (within 1 std dev of prediction)
                hypothetical_predictions[i] = Math.random() * (max - min) + min;
                break
            case "lower than prediction":
                // pick random number from 0.01 to min
                hypothetical_predictions[i] = Math.random() * (min - 0.01) + 0.01;
                break
            case "no precipitation":
                hypothetical_predictions[i] = 0
                break
            default:
                console.log("error in choosing a section")
        }
    }

    // console.log('hypothetical predictions:', hypothetical_predictions)

    return hypothetical_predictions
}


/**
 * Picks an outcome based on weighted categories/specs
 * @param {*} spec The weighted categories
 */
function weightedRand(spec) {
    var i, sum = 0, r = Math.random();

    for (i in spec) {
        sum += spec[i];
        if (r <= sum) return i;
    }
}





function get_time_string(time) {
    let am_pm = 'AM'
    if (time >= 12) {
        am_pm = 'PM'
    }
    let time_string = (time % 12) + am_pm
    if (time == 0) {
        time_string = '12AM'
    } else if (time == 12) {
        time_string = '12PM'
    }
    return time_string
}

export default function build_animated_hop(data) {
    let predictions = data[0];
    og_predictions = predictions
    let chances = data[1];
    og_chances = chances
    build_hop(predictions)
    return update_hop()
}
