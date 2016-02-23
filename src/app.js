var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var fs = require('fs');

app.use(bodyParser.json());
app.post('/endpoint', function(req, res){
	var obj = {};
	console.log(req.body);
	res.send(req.body);
  fs.writeFileSync('static/script.js', req.body.jsFile);
  fs.writeFileSync('static/style.css', req.body.cssFile);
  fs.writeFileSync('static/index.html', req.body.htmlFile);
});

app.get('/a', function (req, res) {
  res.send('Hello World!');
});
app.use(express.static('static'));
app.listen(3000, function () {

  console.log('Example app listening on port 3000!');
});
