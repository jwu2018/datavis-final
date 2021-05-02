// Based on https://bl.ocks.org/gcalmettes/95e3553da26ec90fd0a2890a678f3f69

// Basic setup stuff for the SVG
const margin = { top: 10, right: 30, bottom: 30, left: 30 };

const width = 550 - margin.left - margin.right;

const height = 480 - margin.top - margin.bottom;

const x = d3.scaleLinear().rangeRound([0, width]).domain([2, 11]);

// Make the svg
const svg = d3.select('#svgzone')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// File to open (can be replaced by a function to randomly generate data if needed)
const datafile = 'example.csv';

// Number of bins for the quantiles
const numberOfBins = 20;

// The percentage we want to highlight in the graph
// Bus example, we are ok missing the bus 10% of the time, color 10% of the bins
const percentOk = 0.3;



// Function to draw the dots
function update() {
  // Open the csv file
  d3.csv(datafile).then(function (allData) {
    allData.forEach(function (d) {
      d.Value = +d.Value;
    });

    // Shuffle the data and select a subset of it
    // Basically simulates randomly drawing data points
    const data = d3.shuffle(allData)
      .slice(0, 35);

    // Build the histogram
    const histogram = d3.bin()
      .domain(x.domain())
      .thresholds(x.ticks(numberOfBins))
      .value(function (d) { return d.Value; });

    // Filter away the empty bins
    const bins = histogram(data).filter(d => d.length > 0);

    // a group for each bin
    const binContainer = svg.selectAll('.gBin')
      .data(bins);

    // Make each bin group in the svg and translate it to the right place
    const binContainerEnter = binContainer.enter()
      .append('g')
      .attr('class', 'gBin')
      .attr('transform', d => `translate(${x(d.x0)}, ${height})`);

    // Add the circles
    binContainerEnter.selectAll('circle')
      .data(d => d.map((p, i) => {
        return {
          idx: i,
          name: p.Name,
          value: p.Value,
          radius: (x(d.x1) - x(d.x0)) / 2
        };
      })).enter()
      .append('circle')
      .attr('class', 'enter')
      .attr('cx', 0)
      .attr('cy', function (d) {
        return -d.idx * 2 * d.radius - d.radius;
      })
      .attr('r', 0)
      .transition()
      .duration(500)
      .attr('r', function (d) {
        return (d.length === 0) ? 0 : d.radius;
      });

    binContainerEnter.merge(binContainer)
      .attr('transform', d => `translate(${x(d.x0)}, ${height})`);

    // Enter/update/exit circls inside each containter
    const dots = binContainer.selectAll('circle')
      .data(d => d.map((p, i) => {
        return {
          idx: i,
          name: p.Name,
          value: p.Value,
          radius: (x(d.x1) - x(d.x0)) / 2
        };
      }));

    // Exit old dots no longer in the dataset
    dots.exit()
      .attr('class', 'exit')
      .transition()
      .duration(1000)
      .attr('r', 0)
      .remove();

    // Update old elements already in the data
    dots.attr('class', 'update');

    // Add the new dots to the data
    dots.enter()
      .append('circle')
      .attr('class', 'enter')
      .attr('cx', 0)
      .attr('cy', function (d) {
        return -d.idx * 2 * d.radius - d.radius;
      })
      .attr('r', 0)
      .merge(dots)
      .transition()
      .duration(500)
      .attr('R', function (d) {
        return (d.length === 0) ? 0 : d.radius;
      });

    // The number of bins to color in based on the percent ok
    const binsOk = Math.floor(bins.length * percentOk);
    let counter = 0; // increment and color bins until binsOk is reached
    function determineColor(){
      if(counter < binsOk){
        counter++;
        return 'blue';
      }
      counter++;
      return 'black';
    }

    d3.selectAll(".gBin")
      .attr("fill",determineColor);
  });
}

// Add the x axis
svg.append('g')
  .attr('class', 'axis axis--x')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(x));

// Draw everything the first time
update();

// Update the data (currently every 5 seconds, could be faster or slower)
d3.interval(function () {
  update();
}, 5000);

