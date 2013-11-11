var express = require('express');
var app = express();
app.use(express.bodyParser()); // this is needed to parse the body of requests like POST and PUT

var quotes = [
  { author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
  { author : 'Walt Disney', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
  { author : 'Unknown', text : "Even the greatest was once a beginner. Don't be afraid to take that first step."},
  { author : 'Neale Donald Walsch', text : "You are afraid to die, and you're afraid to live. What a way to exist."}
];


app.get('/', function(req, res) {
  res.type('text/plain');
  res.send('this is a test api spitting out quotes. Use /quotes to see all /quote/random to get a random quote and /quote/[id] to get a defined quote');
});

app.get('/quotes', function(req, res) {
  res.json(quotes);
});

app.get('/quote/random', function(req, res) {
  var id = Math.floor(Math.random() * quotes.length);
  var q = quotes[id];
  res.json(q);
});

app.get('/quote/:id', function(req, res) {
  if(quotes.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

  var q = quotes[req.params.id];
  res.json(q);
});

app.post('/quote', function(req, res) {
  // console.log(req);
  if(!req.body.hasOwnProperty('author') || 
     !req.body.hasOwnProperty('text')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newQuote = {
    author : req.body.author,
    text : req.body.text
  };
  // console.log(newQuote);
  quotes.push(newQuote);
  // console.log(quotes);
  res.json(true);
});

app.listen(process.env.PORT || 8000);