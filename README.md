Twitter-Location_Tracker is a simple node.js site ready to be deployed on Heroku.

It's a simple server that begins a persistant connection with Twitter's streaming API using Twit and Socket.IO.

### Configure:
`npm install` the dependancies. Set your variables, Twitter Creds, Google Map API creds, and create a Heroku app, and deploy it.

Change the socket variable in index.html to the local version, and run `node twit.js` to run locally.

This was originally developed to create http://slurtracker.com, but I've removed references to my specific project, aiming for an easy way to deploy a twitter tracker that maps tweets that you define on a map geographically in real time.

Thanks for looking.