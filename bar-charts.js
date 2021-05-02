/**------------------------------------------------------------------------------------------
 * ?                                         ABOUT
 * @author         :  Imogen Cleaver-Stigum, Andrew Nolan, Matt St. Louis, Jyalu Wu
 * @repo           :  https://github.com/jwu2018/datavis-final
 * @createdOn      :  May 1, 2021
 * @description    :  Bar charts using d3.js
 *------------------------------------------------------------------------------------------**/

const num_data_points = 12

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
function build_barchart(data) {
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
    xScale.domain(Array(num_data_points).fill().map((element, index) => index + 1));
    yScale.domain([0, 1]);

    // x scale
    g.append('g')
        .attr('transform', 'translate(0,' + (graph_height)+ ')')
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('text-anchor', 'end')

    // y scale
    g.append('g')
        .call(d3.axisLeft(yScale).ticks(10))
        .append('text')
        .attr('text-anchor', 'end')

    // Bars
    // TODO add error bars?
    
    for (let i = 0; i < num_data_points; i++) {
        svg.append('rect')
            .attr('fill', 'skyblue')
            .attr('stroke', 'black')
            .attr('transform', 'translate('+margin.left+', '+ margin.bottom+')')
            .attr('x', xScale(i+1))
            .attr('y', yScale(data[i]))
            .attr('height', graph_height - yScale(data[i]))
            .attr("width", xScale.bandwidth())
    }
}

// TODO replace data given by this function with weather data
function gen_rain_data(ndatapoints) {
    let d = []

    for (let i = 0; i < ndatapoints; i++) {
        d[i] = Math.random()
    }

    return d
}

build_barchart(gen_rain_data(num_data_points))

// export{fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS}
