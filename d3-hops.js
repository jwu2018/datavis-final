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
 *                           BUILDING HOPS
 *------------------------------------------------------------------------**/
const num_data_points = 24
const std_dev = 0.02 // std dev for the normal distribution

let svg, og_predictions, og_chances

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
    let xScale = d3.scaleBand().range ([0, graph_width]).padding(0.4),
        yScale = d3.scaleLinear().range ([graph_height, 0]);

    // domains
    xScale.domain(Array(num_data_points).fill().map((element, index) => index + 1));
    yScale.domain([0, 0.6]);

    // x scale
    g.append('g')
        .attr('transform', 'translate(0,' + (graph_height)+ ')')
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('text-anchor', 'end')

    // TODO label axis: light rain, mod, heavy
    // y scale
    g.append('g')
        .call(d3.axisLeft(yScale).ticks(10))
        .append('text')
        .attr('text-anchor', 'end')

    // Bars
    for (let i = 0; i < num_data_points; i++) {
        svg.append('rect')
            .attr('fill', color_by_category(predictions[i]))
            .attr('stroke', 'black')
            .attr('transform', 'translate('+margin.left+', '+ margin.bottom+')')
            .attr('x', xScale(i+1))
            .attr('y', yScale(predictions[i]))
            .attr('height', graph_height - yScale(predictions[i]))
            .attr("width", xScale.bandwidth())
    }
}

function color_by_category(prediction) {
    if (prediction < 0.1) return "lightcyan"
    if (prediction < 0.3) return "skyblue"
    return "deepskyblue"
}

/**
 * Updates the HOP every second
 */
function update_hop() {
    timer = setInterval(function() { 
        remove_svg()
        build_hop(gen_hypothetical_data())
    }, 1000);

    // stopTimer()
    
}

/**
 * Stops the timer and thus stops the HOPs from animating
 */
function stopTimer() {
    alert("Timer stopped");
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
            "close to prediction":(2*og_chances[i]/3), 
            "lower than prediction":(og_chances[i]/3), 
            "no precipitation":(1-og_chances[i])
        });
        console.log('prediction:', og_data[i],'\nchance:', og_chances[i],'\ncategory for bar:\n',category)
        categories[i] = category
    }

    // generate hypothetical predictions
    for (let i = 0; i < num_data_points; i++) {
        let min = og_data[i] - std_dev;
        let max = og_data[i] + std_dev;

        switch(categories[i]) {
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
    var i, sum=0, r=Math.random();

    for (i in spec) {
        sum += spec[i];
        if (r <= sum) return i;
    }
}
  
 
/**------------------------------------------------------------------------
 *                                RUN
 *------------------------------------------------------------------------**/
let foo_data = generate_hourly_data(),
    predictions = foo_data[0],
    chances = foo_data[1];

og_data = predictions
og_chances = chances

build_hop(predictions)
update_hop()
 
 // export{fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS}
 