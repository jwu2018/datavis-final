/**------------------------------------------------------------------------------------------
 * ?                                         ABOUT
 * @author         :  Imogen Cleaver-Stigum, Andrew Nolan, Matt St. Louis, Jyalu Wu
 * @repo           :  https://github.com/jwu2018/datavis-final
 * @createdOn      :  May 1, 2021
 * @description    :  Bar charts using d3.js
 *------------------------------------------------------------------------------------------**/

const num_data_points = 3
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
    // append the svg object to the div called 'my_dataviz'
    svg = d3.select("#svgcontainer")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height)
        // .append("g")
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
    yScale.domain([0, 0.5]);

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
            .attr('fill', 'skyblue')
            .attr('stroke', 'black')
            .attr('transform', 'translate('+margin.left+', '+ margin.bottom+')')
            .attr('x', xScale(i+1))
            .attr('y', yScale(predictions[i]))
            .attr('height', graph_height - yScale(predictions[i]))
            .attr("width", xScale.bandwidth())
    }

    

    
    
}

// TODO update the plot every second
function update_hop() {
    timer = setInterval(function() { 
        remove_svg()
        build_hop(gen_hypothetical_data())
    }, 1000);

    // stopTimer()
    
    return 0
}

function stopTimer() {
    alert("Timer stopped");
    clearInterval(timer); 
}

// generate hypothetical data based on the predictions and chances
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


// Pick an outcome based on weighted categories/specs
function weightedRand(spec) {
    var i, sum=0, r=Math.random();

    for (i in spec) {
        sum += spec[i];
        if (r <= sum) return i;
    }
}
  
 
//  build_hop(gen_rain_data(num_data_points))
let chances = [0.84, 0.66, 0.61],
    predictions = [0.08, 0.07, 0.06];

og_data = predictions
og_chances = chances

build_hop(predictions)
update_hop()
 
 // export{fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS}
 