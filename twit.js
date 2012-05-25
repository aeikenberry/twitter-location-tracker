var Twit = require('twit'),
    app = require('express').createServer(),
    io = require('socket.io').listen(app);

var port = process.env.PORT || 3000;

app.listen(port);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

var slurs = ['nigger', 'polack', 'white power', 'niggers', 'paki', 'niggerz', 'nigaboo', 
            'niglet', 'mexinigger', 'mexi-nigger', 'mexi nigger', 'jigaboo', 'midget', 'eskimo', 
            'jungle bunny', 'chink', 'chinky', 'coolie', 'coon', 'cracka', 'dago', 'towel head',
            'darky', 'darkey', 'darkie', 'dink', 'sand nigger', 'dune coon', 'gook', 
            'gooky', 'guido', 'half-breed', 'kafir', 'Kaffir', 'mosshead', 'nig-nog', 
            'porch monkey', 'nigra', 'niggra', 'nigruh', 'thicklips', 'tar baby', 'chinaman', 
            'Honky', 'goombah', 'wop', 'heeb', 'kike', 'kyke', 'gypped', 'jewed down', 
            'indian giver', 'cotton picker', 'lawn jockey', 'buddhahead', 'chunt', 'cliff ape', 
            'dog fucker', 'dot-head', 'ditchpig', 'dirt-worshipper', 'mulatto', 'africoon', 
            'americoon', 'biscuit lip', 'chain dragger', 'colored people'];

var responses = ['I saw your tweet on slurtracker.com and I totally disapprove!',
                 'Your tweet showed up on slurTracker.com and you should be ashamed of yourself!',
                 'Your gross tweet was on slurtracker.com and I dont like it.',
                 'Did you know that what you tweeted showed up on slurtracker.com? It did, jerk.',
                 'You are ruining our world with that awful language!',
                 'What a mess of our country you are making on slurtracker.com with that gross language!',
                 'Hey buddy, why dont you keep those gross tweets to yourself! I saw you on slurTracker.com!',
                 'You are polluting the world with those tweets! See for yourself at slurtracker.com',
                 "I'll never forgive you for tweeting like that. Everyone on slurTracker dot com saw it!",
                 "You should be ashamed of yourself! Your tweet was on slurTracker.com!",
                 "For shame! Using slurs like that! You can't hide from slurTracker.com!!!",
                 "I'll tell your mom! Think of what she'll say when her baby showed up on slurTracker.com!",
                 "You'll never get anywhere in this world slurring like that! Except on slurTracker.com!",]

var reply_names = new Array();

io.sockets.on('connection', function (socket) {

  stream.on('tweet', function (tweet) {
    var text = tweet['text'];

    var slurFound = false;

    for ( var i = 0; i < slurs.length; i++ ) {
      if ( text.indexOf(slurs[i]) >= 0 ) {
        slurFound = true;
        break;
      };
    };

    if ( slurFound && tweet.user['lang'] == 'en' && text.indexOf('honky tonk') == -1 && text.indexOf('Honky Tonk') == -1 ) {
      socket.emit('stream', tweet);
    }; 
  });

   

  // Disapproval Handler
  socket.on('disapprove', function (data) {
    console.log('disapproval!');
    console.log(data);
    var passing = false;

    if (reply_names.indexOf(data['user']) == -1){
      console.log('61: inside if')
      reply_names.push(data['user']);
      
      T.post('statuses/update', { status: //'@' + data["user"] + ' ' +
             responses[Math.floor(Math.random()*responses.length)] }, function(err, reply) {
        console.log(err);
        console.log(reply);      
        if (reply != null) {  
            console.log('75: inside if reply-text != null')
            //console.log(reply);
          socket.emit('reply', { text: reply['text'], 
                             user: reply.user['screen_name'], 
                             id: reply['id_str'] });
        } else {
          socket.emit('bad-reply', { text: "twitter not ready" } );
        }
      }); 
    }
  }); 

});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10);
  io.set('log level', 1); 
});



var T = new Twit({
    consumer_key:         'esaOWFilC9ytkU8Wd7V8g'
  , consumer_secret:      'hpMt15RRqyxLUz4pkGBYUXQR7TRpCl7Qan1CnyGe2CI'
  , access_token:         '587711519-w4faSgouqMHKRlQ4AcH8EgJuA6whWGnBnlcSXJoR'
  , access_token_secret:  'wQCoPQIdMV0LdUe35ty98FxiBdJpu0jVNpRKbD2k'
});

var stream = T.stream('statuses/filter', { track:slurs.join(',') });
