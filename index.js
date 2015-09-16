var express = require('express')
var request = require('request');
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/stations', function(req,res) {
  var keyword = encodeURI(req.query.q);
  request('http://www.timeforcoffee.ch/api/zvv/stations/' + keyword, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(JSON.parse(body).stations);
    }
  })
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
