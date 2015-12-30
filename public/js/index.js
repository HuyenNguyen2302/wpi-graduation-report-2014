makeGetRequest('/index');

var chart = document.getElementById("chart");

function makeGetRequest(url) {
  var req = new XMLHttpRequest();
  req.onload = function() {
    var arrObj = JSON.parse(this.responseText);  
    var undergradSalaryArr = [];
    var masterSalaryArr = [];
    arrObj.forEach(function (object, i) {
      undergradSalaryArr.push(parseInt(object.undergrad) / 1000);
      masterSalaryArr.push(parseInt(object.master) / 1000);




    var width = 420,
    barHeight = 20;

    var x = d3.scale.linear()
    .domain([0, d3.max(undergradSalaryArr)])
    .range([0, width]);

    var chart = d3.select("#chart")
    .attr("width", width)
    .attr("height", barHeight * undergradSalaryArr.length);

    var bar = chart.selectAll("g")
    .data(undergradSalaryArr)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
    .attr("width", x)
    .attr("height", barHeight - 1);

    bar.append("text")
    .attr("x", function(d) { return x(d) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d; });
    })
  }
  req.open('GET', url);
  req.send();
}

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}