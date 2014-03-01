var namespace = "urn:x-cast:com.google.cast.player.message";  // "urn:x-cast:com.google.cast.media"
var currentSession;
// var mediaIndex = 0;

var photos;
var artist;
var imgIndex = 0;
var $mainPhoto = $('.main_photo');
var newImgSrc;


if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(initializeCastApi, 1000);
}

function initializeCastApi() {
	console.log('init api');
  var sessionRequest = new chrome.cast.SessionRequest('1B4C4253');
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    function (session) {
    	console.log('session listener');
    	session.addMessageListener(namespace, function(str1, str2){
    		console.log('in add addMessageListener callback');
    	})
    },
    function (e) {
      console.log('in receiverListener');
      if( e === chrome.cast.ReceiverAvailability.AVAILABLE) {
        console.log('RECEIVER AVAILABLE!');
      }
    }
  );
  chrome.cast.initialize(apiConfig,
  	function(){
  		console.log('init success!');
  	},
  	function(error) {
      console.log('init fail');
  		console.log(error);
  	});
}

function launchAppOnReceiver() {
  chrome.cast.requestSession(
    function(session) {
      console.log('request session launch success');
      console.log(session);
      currentSession = session;
      // loadMedia(session);
    },
    function(error) {
      console.log('request session on launch error');
      console.log(error);
    }
  );  
}

mediaURLS = ["http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af37e4b0b0787cdee82f/1391898428924/img073.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af4de4b0b0787cdee856/1391898449718/img080.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af37e4b0b0787cdee82f/1391898428924/img073.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af4de4b0b0787cdee856/1391898449718/img080.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af37e4b0b0787cdee82f/1391898428924/img073.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af4de4b0b0787cdee856/1391898449718/img080.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af37e4b0b0787cdee82f/1391898428924/img073.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af4de4b0b0787cdee856/1391898449718/img080.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af37e4b0b0787cdee82f/1391898428924/img073.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af4de4b0b0787cdee856/1391898449718/img080.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af37e4b0b0787cdee82f/1391898428924/img073.jpg",
             "http://static.squarespace.com/static/52f68d9ee4b086cbdc0c8a73/t/52f6af4de4b0b0787cdee856/1391898449718/img080.jpg"];

function loadMedia(session) {
  console.log('loading media');
  console.log(session);
  // console.log(mediaIndex);
  // currentMediaURL = mediaURLS[mediaIndex];
  // mediaIndex++;
  mediaURL = newImgSrc;
  console.log('mediaURL');
  console.log(mediaURL);
  var mediaInfo = new chrome.cast.media.MediaInfo(mediaURL);
  mediaInfo.contentType = 'image/jpg';
  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  console.log(mediaInfo);
  console.log(request);
  console.log('attempting to session.loadMedia');
  session.loadMedia(request,
    onMediaDiscovered.bind(this, 'loadMedia'),
    function (e) {
      console.log('media error');
      console.log(e);
    });
}

function onMediaDiscovered(how, media) {
  console.log('media discovered');
}

function verifyCurrentSession(mediaURL) {
  if (typeof currentSession !== "undefined") {
    loadMedia(currentSession);
  } else {
    console.log('no currentSession');
  }
}

window.setInterval(changeImage, 3000);


$( document ).ready(function() {
  R.ready(function() {
    if (R.authenticated() == false) {
      R.authenticate();
    }
    artist = R.player.playingTrack().get('artist');
    console.log('PAGE LOADED: ARTIST');
    console.log(artist);
    if (artist == 'undefined') {
      console.log("no artist :(")
    } else {
      getArtistImages(artist);
    }
    R.player.on("change:playingTrack", function(newTrack) {
      newArtist = newTrack.get("artist");
      console.log(newArtist);
      // newArtist = R.player.playingTrack().get('artist')
      console.log('NEW ARTIST?')
      if (artist != newArtist) {
        console.log('new artist! get images');
        console.log(newArtist);
        artist = newArtist;
        imgIndex = 0;
        getArtistImages(artist);
      } else {
        console.log('same artist');
        console.log(artist);
      }
    });
  });
  getArtistImages(artist);
});

function getArtist() {
  newArtist = R.player.playingTrack().get('artist')
  console.log('NEW ARTIST?')
  console.log(newArtist);
  if (artist != newArtist) {
    console.log('new artist! get images');
    console.log(newArtist);
    artist = newArtist;
    imgIndex = 0;
    getArtistImages(artist);
  } else {
    console.log('same artist');
    console.log(artist);
  }
}

function changeImage() {
  console.log(photos);
  photo =  photos["photos"]["photo"][imgIndex];
  newImgSrc = "http://farm" + photo["farm"] + ".staticflickr.com/" + photo["server"] + "/" + photo["id"] + "_" + photo["secret"] + ".jpg"; // _b.jpg
  if (typeof currentSession !== "undefined") {
    console.log('change image --> load the media!');
    loadMedia(currentSession);
    // $mainPhoto.attr("src", newImgSrc);
    console.log(imgIndex);
    if ((photos["photos"]["total"] == imgIndex + 1) || (imgIndex > 20)) {
      imgIndex = 0;
    } else {
       imgIndex++;   
    }
      console.log('changed image');
      console.log(newImgSrc);
  }
};

function getArtistImages(artist) {
  var searchText = artist
    var flickrAPIKey = "8454abf0de1b662a841201d59dd6b2e9";
    var flickrAPI = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickrAPIKey + "&text=" + searchText + "&privacy_filter=1&sort=relevance&format=json&jsoncallback=?";
    $.getJSON( flickrAPI )
      .done(function( data ) {
        console.log('returned data');
        console.log(data);
        photos = data;
        changeImage();
      });
};  





