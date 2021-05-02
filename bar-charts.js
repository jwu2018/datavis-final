const margin = { top: 20, right: window.innerWidth / 10, bottom: 80, left: window.innerWidth / 10, radius: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

const LEFT_MARGIN = height/2

const svg_width = width
const radius = Math.min(width, height) / 2 - margin.radius // pie radius

// append the svg object to the div called 'my_dataviz'
let svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", height)
    .append("g")

function build_barchart(data) {
    let numBars = DATAPOINT_COUNTS.bar
    let max = Math.max.apply(null, data)

    // let markedBars = indices_to_compare(10)
    // let markedBars = indices

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, max])
        .range([height, 0]);

    // plain lines for axes - no ticks or numbers 
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', height)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('id', 'yAxis')
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', height)
        .attr('x2', width)
        .attr('y2', height)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('id', 'xAxis')

    // Bars
    let interval = width / numBars / 10
    let barWidth = width / numBars / 5 * 4
    for (let i = 0; i < numBars; i++) {
        svg.append('rect')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('x', i * (interval * 2 + barWidth) + interval)
            .attr('y', y(data[i]))
            .attr('height', height - y(data[i]))
            .attr('width', barWidth)
        // if (i === markedBars.random_idx || i === markedBars.other_idx) {
        //     svg.append('circle')
        //         .attr('r', barWidth / 8)
        //         .attr('cy', height - interval * 2)
        //         .attr('cx', i * (interval * 2 + barWidth) + interval + barWidth / 2)
        //         .attr('fill', 'black')
        // }
    }
}









function indices_to_compare(ndatapoints) {
    while (true) {
        let random_idx = randInt(0, ndatapoints - 1)
        let other_idx = (random_idx + randInt(1, ndatapoints - 1)) % ndatapoints
        // let random_idx = d3.randomInt(0, ndatapoints - 1)()
        // let other_idx = (random_idx + d3.randomInt(1, ndatapoints - 1)()) % ndatapoints
        if (Math.abs(random_idx - other_idx) > MIN_BAR_GAP) {
            return { random_idx, other_idx };
        }
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function gen_data(ndatapoints) {
    let d = []
    let valid_dataset = false

    while (!valid_dataset) {
        let sum = 0
        for (let i = 0; i < ndatapoints; i++) {
            d[i] = Math.random()
            sum += d[i]
        }

        for (let j = 0; j < ndatapoints; j++) {
            d[j] = d[j] / sum * 100
        }
        let valid = true
        for (let i = 0; i < ndatapoints; i++) {
            if (d[i] < 3 || d[i] > 39) {
                valid = false
            }
            for (let k = 0; k < ndatapoints; k++) {
                if (k !== i && Math.abs(d[i] - d[k]) < .1) {
                    valid = false
                }
            }
        }
        valid_dataset = valid
    }
    return d
}

// export{fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS}

/**------------------------------------------------------------------------
 *                           ALL CHARTS
 *------------------------------------------------------------------------**/

//  function fillChart(chartType, chartData, indices) {
//     const margin = { top: 20, right: window.innerWidth / 10, bottom: 80, left: window.innerWidth / 10, radius: 40 },
//         width = window.innerWidth - margin.left - margin.right,
//         height = 600 - margin.top - margin.bottom;

//     const LEFT_MARGIN = height/2
    
//     const svg_width = width
//     const radius = Math.min(width, height) / 2 - margin.radius // pie radius

//     // append the svg object to the div called 'my_dataviz'
//     let svg = d3.select("#svgcontainer")
//         .append("svg")
//         .attr("width", svg_width)
//         .attr("height", height)
//         .append("g")
    
//     // NOTE: the upper limit for number of datapoints is 17, otherwise it takes too long to generate the random data
//     switch(chartType) {
//         case CHARTS.bar:  // Recommended data: 10
//             build_barchart(chartData)
//             break;
//         // case CHARTS.pie:  // Recommended data: 10
//         //     build_pie(chartData);
//         //     break;
//         // case CHARTS.spiral:  // Recommended data: 17
//         //     build_spiral_barchart(chartData) 
//         //     break;
//         default: 
//             alert(`Invalid chart type specified`);
//             debugger;
//     }
// }