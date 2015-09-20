var express = require('express')
var request = require('request');
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/stations', function(req,res) {
  var keyword = encodeURI(req.query.q);
  request(
    {
      uri: 'http://online.fahrplan.zvv.ch/bin/ajax-getstop.exe/dny',
      qs: {
        start: '1',
        tpl: 'suggest2json',
        REQ0JourneyStopsS0A: 1, //only Bhf/Hst
        getstop: 1,
        noSession: 'yes',
        REQ0JourneyStopsB: 10, //number of suggestions
        REQ0JourneyStopsS0G: keyword //keyword for search
      }
    }
    , function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var clean = body.replace(/SLs\.sls=(.*);SLs\.showSuggestion\(\);/, '$1');
      var json = JSON.parse(clean).suggestions;
      var data = json
      .map(function(obj){
        var rObj = {};
        rObj.id = obj.extId;
        rObj.name = obj.value;
        return rObj;
      });
      res.send(data);
    }
  });
  //Alternative API via timeforcoffee.ch
  //request('http://www.timeforcoffee.ch/api/zvv/stations/' + keyword, function (error, response, body) {
    //if (!error && response.statusCode == 200) {
      //res.send(JSON.parse(body).stations);
    //}
  //})
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
