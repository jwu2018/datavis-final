/**------------------------------------------------------------------------------------------
 * ?                                         ABOUT
 * @author         :  Imogen Cleaver-Stigum, Andrew Nolan, Matt St. Louis, Jyalu Wu
 * @repo           :  https://github.com/jwu2018/datavis-final
 * @createdOn      :  May 1, 2021
 * @description    :  Bar charts using d3.js
 *------------------------------------------------------------------------------------------**/


const margin = { top: 20, right: window.innerWidth / 10, bottom: 80, left: window.innerWidth / 10, radius: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// const LEFT_MARGIN = height/2

const svg_width = width
// const radius = Math.min(width, height) / 2 - margin.radius // pie radius

const num_data_points = 7

// append the svg object to the div called 'my_dataviz'
let svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", height)
    .append("g")

console.log('appended svg')

function build_barchart(data) {
    let numBars = num_data_points
    let max = Math.max.apply(null, data)

    console.log('data:', data)

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, max])
        .range([height, 0]);

    // append graph to svg
    let g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('id', 'barchart')

    let xScale = d3.scaleBand().range ([0, svg_width - 2*margin.right]).padding(0.4),
        yScale = d3.scaleLinear().range ([height - margin.bottom, 0]);

    // domains
    xScale.domain(Array(7).fill().map((element, index) => index + 1));
    yScale.domain([0, 1]);

    // x scale
    g.append('g')
        .attr('transform', 'translate(0,' + (height - margin.bottom)+ ')')
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
    // TODO fix spacing between bars
    let interval = width / numBars / 10
    let barWidth = width / numBars
    for (let i = 0; i < numBars; i++) {
        svg.append('rect')
            .attr('fill', 'skyblue')
            .attr('stroke', 'black')
            .attr('transform', 'translate('+margin.left+', '+ (margin.top - margin.bottom)+')')
            .attr('x', i * (interval * 2 + barWidth) + interval)
            .attr('y', yScale(data[i]))
            .attr('height', height - yScale(data[i]))
            .attr('width', barWidth)
    }
}









// function indices_to_compare(ndatapoints) {
//     while (true) {
//         let random_idx = randInt(0, ndatapoints - 1)
//         let other_idx = (random_idx + randInt(1, ndatapoints - 1)) % ndatapoints
//         // let random_idx = d3.randomInt(0, ndatapoints - 1)()
//         // let other_idx = (random_idx + d3.randomInt(1, ndatapoints - 1)()) % ndatapoints
//         if (Math.abs(random_idx - other_idx) > MIN_BAR_GAP) {
//             return { random_idx, other_idx };
//         }
//     }
// }

// function randInt(min, max) {
//     return Math.floor(Math.random() * (max - min)) + min
// }


// TODO replace data given by this function with weather data
function gen_rain_data(ndatapoints) {
    let d = []

    for (let i = 0; i < ndatapoints; i++) {
        d[i] = Math.random()
    }

    return d

    // while (!valid_dataset) {
    //     let sum = 0
    //     for (let i = 0; i < ndatapoints; i++) {
    //         d[i] = Math.random()
    //         sum += d[i]
    //     }

    //     for (let j = 0; j < ndatapoints; j++) {
    //         d[j] = d[j] / sum * 100
    //     }
    //     let valid = true
    //     for (let i = 0; i < ndatapoints; i++) {
    //         if (d[i] < 3 || d[i] > 39) {
    //             valid = false
    //         }
    //         for (let k = 0; k < ndatapoints; k++) {
    //             if (k !== i && Math.abs(d[i] - d[k]) < .1) {
    //                 valid = false
    //             }
    //         }
    //     }
    //     valid_dataset = valid
    // }
    // return d
}



data = [0.4722171315419039, 0.6333666774754096, 0.8175076300088477, 0.8290657584182193, 0.9995232795286748, 0.38928762472126244, 0.36459991388027535]
// build_barchart(gen_rain_data(num_data_points))
build_barchart(data)

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