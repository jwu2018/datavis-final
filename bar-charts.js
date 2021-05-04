/**------------------------------------------------------------------------------------------
 * ?                                         ABOUT
 * @author         :  Imogen Cleaver-Stigum, Andrew Nolan, Matt St. Louis, Jyalu Wu
 * @repo           :  https://github.com/jwu2018/datavis-final
 * @createdOn      :  May 1, 2021
 * @description    :  Bar charts using d3.js
 *------------------------------------------------------------------------------------------**/

/***************************************************************** */
/* data generation
/***************************************************************** */

function generate_hourly_data(pop_range_start = 0, pop_range_end = 1, type = null, n = 24) {
    // start with a totally random pop between pop_range_start and pop_range_end
    let pops = []
    pops[0] = Math.round(random_in_range(pop_range_start, pop_range_end) * 20) / 20

    // then decide randomly ascending or descending pop
    let isAscending = !!Math.round(Math.random())

    // 90% chance to continue ascending or descending based on that decision
    // switch to descending once hit 90%+
    // change pop by increments of 0-20%

    let decision_boundary = .8
    let max_increment = (pop_range_end - pop_range_start) / 4

    let decision = Math.random()

    for (let i = 1; i < n; i++) {
        decision = Math.random()
        increment = random_in_range(0, max_increment)

        if ((decision >= decision_boundary && isAscending) || (decision < decision_boundary && !isAscending)) {
            // ascending
            pops[i] = pops[i - 1] + increment
        } else {
            // descending
            pops[i] = pops[i - 1] - increment
        }

        if (pops[i] >= pop_range_end) { // reached max pop
            isAscending = !isAscending
            if (pops[i] > pop_range_end) {
                pops[i] = pop_range_end
            }
        }
        if (pops[i] <= pop_range_start) { // reached min pop
            isAscending = !isAscending
            if (pops[i] < pop_range_start) {
                pops[i] = pop_range_start
            }
        }
        pops[i] = Math.round(pops[i] * 20) / 20
    }

    // inches of precipitation
    let amounts = []
    let min_amount = 0
    let max_amount = .6
    let no_rain_boundary = .1

    for (let i = 0; i < pops.length; i++) {
        // if (pops[i] <= no_rain_boundary) {
        //     amounts[i] = min_amount
        // } else {
        amounts[i] = random_in_range(min_amount, max_amount) * pops[i]
        if (pops[i] >= .1) {
            amounts[i] += .05
        }
        amounts[i] = Math.round(amounts[i] * 20) / 20
        // }
    }
    return [amounts, pops]
    // return pops
}

function random_in_range(range_start = 0, range_end = 1) {
    return Math.random() * (range_end - range_start) + range_start
}





































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


// append the svg object to the div called 'my_dataviz'
let svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height)
    .append("g")

console.log('appended svg')

/**------------------------------------------------------------------------
 *                           Build the Bar Chart
 *------------------------------------------------------------------------**/
function build_barchart(data, chances) {
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
    // TODO change x scale to 1PM, 2PM, est
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




// build_barchart(gen_rain_data(num_data_points))
foo_data = generate_hourly_data()
build_barchart(foo_data[0], foo_data[1])

// export{fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS}
