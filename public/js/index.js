// reference: http://bl.ocks.org/erikvullings/51cc5332439939f1f292

var chart = document.getElementById("chart");
var legend = document.getElementById("legend");
// var extra_info = document.getElementById("extra_info");

var legendRectSize = 18,
legendSpacing  = 20;

d3.csv('data.csv', function(err, d) {
  var keys = Object.keys(d[0]); // get all the attributes: major, Undergraduates, Master's

  var majors = []; 
  var undergraduates_salaries = [];
  var masters_salaries = []; 
  var companies = [];
  var double_majors = [];
  var graduate_schools = [];

  d.forEach(function(obj) {
    majors.push(obj.major);
    undergraduates_salaries.push(parseInt(obj.Undergraduates));
    masters_salaries.push(parseInt(obj.Master));
    companies.push(obj.companies);
    double_majors.push(obj.double_majors);
    graduate_schools.push(obj.graduate_schools);
  });

  var data = {
    labels: majors, // replaced with list of majors
    series: [
    {
      label: keys[1], // replaced with Undergraduates salaries
      values: undergraduates_salaries
    },
    {
      label: keys[2], // replaced with Masters salaries
      values: masters_salaries
    }]
  };

  var chartWidth   = 300,
  barHeight        = 20,
  groupHeight      = barHeight * data.series.length,
  gapBetweenGroups = 10,
  spaceForLabels   = 280;

  // Zip the series data together (first values, second values, etc.)
  var zippedData = [];
  for (var i=0; i<data.labels.length; i++) {
    for (var j=0; j<data.series.length; j++) {
      zippedData.push(data.series[j].values[i]);
    }
  }

  // Color scale
  var color = d3.scale.category20();
  var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

  var x = d3.scale.linear()
  .domain([0, d3.max(zippedData)])
  .range([0, chartWidth]);

  var y = d3.scale.linear()
  .range([chartHeight + gapBetweenGroups, 0]);

  var yAxis = d3.svg.axis()
  .scale(y)
  .tickFormat('')
  .tickSize(0)
  .orient("left");

  // Specify the chart area and dimensions
  var chart = d3.select(".chart")
  .attr("width", spaceForLabels + chartWidth)
  .attr("height", chartHeight + legendRectSize + legendSpacing);

  // Set up the extra_info div
  // extra_info.setAttribute("style","display:block; width:" + spaceForLabels + chartWidth + "px;");
  // extra_info.style.width = 200 + "px";

  // Create bars
  var bar = chart.selectAll("g")
  .data(zippedData)
  .enter().append("g")
  .attr("transform", function(d, i) {
    return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
  });

  // Create rectangles of the correct width
  bar.append("rect")
  .attr("fill", function(d,i) { return color(i % data.series.length); })
  .attr("class", "bar")
  .attr("width", x)
  .on('click', displayinfo)
  .attr("height", barHeight - 1);

  //// TESTSSTSTTSTSTS
  bar.selectAll("rect")
  .on('click', function(d) {

        d3.select(this).classed('highlight', true);
        $(document).click(function(e) {
          console.log("this = " + $(this).class);
          console.log("e.target = " + $(e.target));
          if(!$(e.target).is($(this))) {
            $(this).removeClass("highlight");
            console.log("here");
          }
        });
      });

  $("#highlight").unbind("click");

  // Add text label in bar
  bar.append("text")
  .attr("x", function(d) { return x(d) - 3; })
  .attr("y", barHeight / 2)
  .attr("fill", "red")
  .attr("dy", ".35em")
  .text(function(d) { return "$" + d; });

  // Draw labels
  bar.append("text")
  .attr("class", "label")
  .attr("x", function(d) { return - 10; })
  .attr("y", groupHeight / 2)
  .attr("dy", ".35em")
  .text(function(d,i) {
    if (i % data.series.length === 0)
      return data.labels[Math.floor(i/data.series.length)];
    else
      return ""})
  .on('click', displayinfo);


  chart.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
  .call(yAxis);

  // Draw legend
  var textOffSet = 4;
  
  var legend = chart.selectAll('.legend')
  .data(data.series)
  .enter()
  .append('g')
  .attr('transform', function (d, i) {   
    var height = legendRectSize + legendSpacing;
    var offset = -gapBetweenGroups/2;
    // var horz = spaceForLabels + chartWidth + 100 - legendRectSize;
    var vert = i * height - offset;
    // var spaceForLabels + chartWidth + spaceForLegend
    var horz = spaceForLabels + (i) * 150;
    var vert = chartHeight + legendSpacing;
    return 'translate(' + horz + ',' + vert + ')';
  })
  .attr("class", "legendEntry");

  legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', function (d, i) { return color(i); })
  .style('stroke', function (d, i) { return color(i); });

  legend.append('text')
  .attr('class', 'legend')
  .attr('x', legendRectSize + textOffSet)
  .attr('y', legendRectSize - textOffSet)
  .text(function (d) { return d.label; });

  var svg = d3.select("body");
  var majors = svg.selectAll(".bar")
  .data(data)
  .enter();

  // display information about graduate schools, double majors, and companies
  function displayinfo(d, i) {
    // display graduate schools
    var graduate_schools_commasplit = graduate_schools[Math.floor(i / 2)].split(',');
    var graduate_schools_elt = document.getElementById('graduate_schools');
    graduate_schools_elt.innerHTML = '';
    graduate_schools_commasplit.forEach(function(entry) {
      graduate_schools_elt.innerHTML += '<div class="entry">' + entry + '</div>'; 
    })

    // display double majors
    var double_majors_commasplit = double_majors[Math.floor(i / 2)].split(',');
    var double_majors_elt = document.getElementById('double_majors');
    double_majors_elt.innerHTML = '';
    double_majors_commasplit.forEach(function(entry) {
      double_majors_elt.innerHTML += '<div class="entry">' + entry + '</div>'; 
    })
    // d3.select(this).classed("refill", "white");

    // display companies
    var companies_commasplit = companies[Math.floor(i / 2)].split(',');
    var companies_elt = document.getElementById('companies');
    companies_elt.innerHTML = '';
    companies_commasplit.forEach(function(entry) {
      companies_elt.innerHTML += '<div class="entry">' + entry + '</div>'; 
    })
  }
});

