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
 *                           BAR CHARTS COMMENCE
 *------------------------------------------------------------------------**/
const num_data_points = 24

const margin = { 
    top: window.innerHeight / 10, 
    bottom: window.innerHeight / 10, 
    left: window.innerWidth / 10, 
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



/**------------------------------------------------------------------------
 *                           Build the Bar Chart
 *------------------------------------------------------------------------**/
function build_barchart(data, chances) {
    // append the svg object to the div called 'my_dataviz'
    let svg = d3.select("#svgcontainer")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .append("g")
    
    console.log('appended svg')
    
    let max = Math.max.apply(null, data)

    console.log('data:', data)

    // append graph to svg
    let g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('id', 'barchart')

    // x and y scales
    let xScale = d3.scaleBand().range ([0, graph_width]).padding(0.4),
        yScale = d3.scaleLinear().range ([graph_height, 0]);

    // domains
    xScale.domain(Array(num_data_points).fill().map((element, index) => index));
    yScale.domain([0, 0.6]);


    var x_axis = d3.axisBottom()
        .scale(xScale)
        .tickValues(Array(num_data_points).fill().map((element, index) => index))
        .tickFormat(function(d){ return get_time_string(d); });

    // x scale
    g.append('g')
        .attr('transform', 'translate(0,' + (graph_height)+ ')')
        .call(x_axis)
        // .append('text')
        // .text(function(data) {return get_time_string(data);})
        // .text('midnight')
        .attr('text-anchor', 'end')
        // .tickValues([1, 2, 3, 5, 8, 13, 21])
        // .tickFormat(function(d, i){ return "Num = " + d; });

    // y scale
    g.append('g')
        .call(d3.axisLeft(yScale).ticks(10))
        .append('text')
        .attr('text-anchor', 'end')

    // Bar colors
    function color_by_category(prediction) {
        if (prediction < 0.1) return "lightcyan"
        if (prediction < 0.3) return "deepskyblue"
        return "steelblue"
    }
    
    // Build bars
    for (let i = 0; i < num_data_points; i++) {
        svg.append('rect')
            // .attr('fill', 'skyblue')
            .attr('fill', color_by_category(data[i]))
            .attr('stroke', 'black')
            .attr('transform', 'translate('+margin.left+', '+ margin.bottom+')')
            .attr('x', xScale(i))
            .attr('y', yScale(data[i]))
            .attr('height', graph_height - yScale(data[i]))
            .attr("width", xScale.bandwidth())
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

export { build_barchart }