var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var d3_dsv = require("d3-dsv");
var fs = require('fs');
var app = express();
var port = process.env.PORT || 3000;
var csv = d3_dsv.dsv(",");

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function() {
	console.log('App is listening on port ' + port);
});

var data = csv.parse(fs.readFileSync(__dirname + '/data.csv').toString(), function(d) {
  return {
    major: d.major,
    undergrad: d.undergrad,
    master: d.master
  };  
});

app.get('/index', function(req, res) {
	var arrObj = [];
	data.forEach( function(object, i) {
		arrObj.push(object);
	})
	var arrObjString = JSON.stringify(arrObj);
	res.writeHead(200, {"Content-Type": "text/html"});
	res.end(arrObjString);
});
