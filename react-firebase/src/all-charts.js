/**============================================================================================================
 *                               Charts
 *============================================================================================================**/
import * as d3 from 'd3';


const MIN_BAR_GAP = 1



const DATAPOINT_COUNTS = {
    bar: 10,
    pie: 10,
    spiral: 17,
}

const CHARTS = {
    bar: 'bar',
    pie: 'pie',
    spiral: 'spiral',
}

function fillChart(chartType, chartData, indices) {
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
    
    // NOTE: the upper limit for number of datapoints is 17, otherwise it takes too long to generate the random data
    switch(chartType) {
        case CHARTS.bar:  // Recommended data: 10
            build_barchart(chartData)
            break;
        case CHARTS.pie:  // Recommended data: 10
            build_pie(chartData);
            break;
        case CHARTS.spiral:  // Recommended data: 17
            build_spiral_barchart(chartData) 
            break;
        default: 
            alert(`Invalid chart type specified`);
            debugger;
    }

    function build_pie(data) {

        // Compute the position of each group on the pie:
        let pie = d3.pie()
            .value(function (d) { return d.value; }).sort(null);
        // I looked it up, and apparently they removed d3.entries in v6
        // https://rdrr.io/cran/d3r/f/inst/www/d3/v6/CHANGES.md
        let data_ready = pie(d3.entries(data))
    
        // shape helper to build arcs:
        let arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
    
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
            .selectAll('slices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .attr('fill', 'white')
            .attr("stroke", "black")
            .style("stroke-width", "1px")
            .attr("transform", "translate(" + LEFT_MARGIN + "," + height / 2 + ")");
    
    
        // Replaced with outer function parameter
        // let indices = indices_to_compare(data.length)
    
        // Now add the annotation. Use the centroid method to get the best coordinates
        svg
            .selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('text')
            .text(function (d) {
                if (parseInt(d.data.key) == indices.random_idx || parseInt(d.data.key) == indices.other_idx) {
                    return '.'
                }
            })
            .attr("transform", function (d) {
                let coords = arcGenerator.centroid(d)
                return "translate(" + (coords[0] + LEFT_MARGIN) + ',' + (coords[1] + height / 2) + ")";
            })
            .style("font-size", 40)
            
        return {data, indices}
    }
    
    function build_barchart(data) {
    
        let numBars = DATAPOINT_COUNTS.bar
        let max = Math.max.apply(null, data)
    
        // let markedBars = indices_to_compare(10)
        let markedBars = indices
    
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
            if (i === markedBars.random_idx || i === markedBars.other_idx) {
                svg.append('circle')
                    .attr('r', barWidth / 8)
                    .attr('cy', height - interval * 2)
                    .attr('cx', i * (interval * 2 + barWidth) + interval + barWidth / 2)
                    .attr('fill', 'black')
            }
        }
    }
    
    
    function build_spiral_barchart(data) {
    
        let start = 0,
            end = 2.25,
            numSpirals = 1.2
    
        // let markedBars = indices_to_compare(data.length)
        let markedBars = indices
    
        let theta = function (r) {
            return numSpirals * Math.PI * r;
        };
    
        let r = d3.min([width, height]) / 2 - 40;
        let radius = d3.scaleLinear()
            .domain([start, end])
            .range([40, r]);
    
        let points = d3.range(start, end + 0.001, (end - start) / 1000);
    
        let spiral = d3.radialLine()
            .curve(d3.curveCardinal)
            .angle(theta)
            .radius(radius);
        let path = svg.append("path")
            .datum(points)
            .attr("id", "spiral")
            .attr("d", spiral)
            .style("fill", "none")
            .style("stroke", "none")
            .attr("transform", function (d) {
                return "translate(" + LEFT_MARGIN + ',' + height / 2 + ")";
            })
    
        let spiralLength = path.node().getTotalLength(),
            N = data.length,
            barWidth = (spiralLength / N) - 1;
    
        let someData = [];
        for (let i = 0; i < N; i++) {
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + i);
            someData.push({
                date: currentDate,
                value: data[i],
                group: currentDate.getMonth()
            });
        }
        let timeScale = d3.scaleTime()
            .domain(d3.extent(someData, function (d) {
                return d.date;
            }))
            .range([0, spiralLength]);
    
        // yScale for the bar height
        let yScale = d3.scaleLinear()
            .domain([0, 25])
            .range([0, (r / numSpirals) - 30]);
    
        svg.selectAll("rect")
            .data(someData)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
    
                let linePer = timeScale(d.date),
                    posOnLine = path.node().getPointAtLength(linePer),
                    angleOnLine = path.node().getPointAtLength(linePer - barWidth);
    
                d.linePer = linePer; // % distance are on the spiral
                d.x = posOnLine.x; // x postion on the spiral
                d.y = posOnLine.y; // y position on the spiral
    
                d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position
    
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("width", function (d) {
                return barWidth / 1.2;
            })
            .attr("height", function (d) {
                return yScale(d.value);
            })
            .style("fill", 'none')
            .style("stroke", "black")
            .attr("transform", function (d) {
                return "translate(" + LEFT_MARGIN + ',' + height / 2 + "),rotate(" + d.a + "," + d.x + "," + d.y + ")";
            })
    
        svg.selectAll("circle")
            .data(someData)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                let linePer = timeScale(d.date) - spiralLength / N / 2 + 1,
                    posOnLine = path.node().getPointAtLength(linePer),
                    angleOnLine = path.node().getPointAtLength(linePer - barWidth);
    
                d.linePer = linePer; // % distance are on the spiral
                d.x = posOnLine.x; // x postion on the spiral
                d.y = posOnLine.y; // y position on the spiral
    
                d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position
    
                if (i == 0){
                    d.x = d.x + barWidth/2 - 7
                }
                return d.x + 0;
            })
            .attr("cy", function (d, i) {
                if (i == 0){
                    d.y = d.y - 7
                }
                return d.y;
            })
            .attr("r", 2)
            .style("fill", function (d, i) {
                if (i === markedBars.random_idx || i === markedBars.other_idx) {
                    return 'black'
                }
                return 'none'
            })
            .attr("transform", function (d) {
                return "translate(" + LEFT_MARGIN + ',' + height / 2 + ")";
            })
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

export{fillChart, gen_data, CHARTS, indices_to_compare, DATAPOINT_COUNTS}