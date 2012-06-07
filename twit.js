// Do some imports
var Twit = require('twit'),
    app = require('express').createServer(),
    io = require('socket.io').listen(app);

// Set up your app's environment
var port = process.env.PORT || 3000;
app.listen(port);
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Socket.io config
io.configure(function () {
  io.set("transports", ["xhr-polling"]); // Heroku requires this (of socket.io).
  io.set("polling duration", 10); // Heroku requires this (of socket.io).
  io.set('log level', 1); // Prevents overly-messy logs.
});

// Set up your Twitterz
var keywords = ['some', 'words', 'or phrases', 'to', 'track'];

var T = new Twit({
    consumer_key:         '...',
    consumer_secret:      '...',
    access_token:         '...',
    access_token_secret:  '...'
});

var stream = T.stream('statuses/filter', { track:keywords.join(',') });


// When a client connects...
io.sockets.on('connection', function (socket) {
  // Start sending them tweets in real-time.
  stream.on('tweet', function (tweet) {
    var text = tweet['text'];
    var keywordFound = false;

    // use this when tracking phrases with whitespace
    for ( var i = 0; i < keywords.length; i++ ) {
      if ( text.indexOf(keywords[i]) >= 0 ) {
        keywordFound = true;
        break;
      }
    }

    if ( keywordFound ) {
      socket.emit('stream', tweet);
    }

  });
  
});