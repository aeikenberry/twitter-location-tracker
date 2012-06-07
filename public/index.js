// Local Dev/Prod switch
var socket = io.connect('http://yourapp.herokuapp.com/');
//var socket = io.connect('http://localhost:3000');

var map,
    geocoder = new google.maps.Geocoder();
   //icon = 'http://icon_url.png';

// Set up a single InfoWindow, so that only one will be open at a time.
var infowindow = new google.maps.InfoWindow({
      maxWidth: 350
    });

function initialize() {

    // Set up your Google map
      var myOptions = {
        center: new google.maps.LatLng(35.960223, -81.386719),
        
        zoom: 2,
        
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.RIGHT_TOP
        },

        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },

        panControl: false,
        scaleControl: false,
        streetViewControl: false
      };
      
      map = new google.maps.Map(document.getElementById("map_canvas"),
          myOptions);
}

// this function calls Google's Geocoder API.
function geocode(address, callback) {
    geocoder.geocode( { 'address': address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            callback(results[0].geometry.location);
        }
        else {
            callback("Error");
        }
    });
}
  
socket.on('stream', function (tweet) {

  var user_img = tweet.user.profile_image_url;
  var user_name = tweet.user.name;
  var screen_name = tweet.user.screen_name;
  var text = tweet.text;
  var locale;

  var tweetBox = 'Place what you want to show up in your infoBox here';
  
  // Send this tweet to the geocoder to grab it's coordinates
  geocode(tweet.user.location, coded);

  // Once it's geocoded, we can drop it on the map.
  function coded(location) {
    
    if (location == "Error") { // If the location isn't valid

      console.log('geocode fail.');

    } 
    
    // Creates a LatLng object for the coordinates
    var tweetCoordinates = new google.maps.LatLng(location.$a, location.ab);
    
    // Creates the marker. Define icon as a png and assign it here to 
    // use a custom icon.
    var marker = new google.maps.Marker({

      map: map,
      position: tweetCoordinates,
      title: text,
      //icon: icon,  
      animation: google.maps.Animation.DROP
    });
    
    // What to do when a marker is clicked
    google.maps.event.addListener(marker, 'click', function() {

      // marker.setIcon('http://visited-marker/url.png');
      infowindow.setContent(tweetBox);
      infowindow.open(map,marker);
    
    }); 

  }

  // if they don't give a location, let's not leave it blank. 
  if (tweet.user.location === '' || tweet.user.location === null) {
    locale = "I didn't put anything!";
  } else {
    locale = tweet.user.location;
  }

  // it's passed our tests, put it in the 'ticker' at the bottom.
  currentTweet(tweet, locale);

  function currentTweet (tweet, location) {

    $('#stream').html('<li><b>Tweet:</b> ' + text + '</li>' + 
                      '<li><b>Location:</b> ' + location + '</li>').fadeIn();
    
    var s = setTimeout(function() { $('#stream').fadeOut(); }, 3000);
    
  }

});