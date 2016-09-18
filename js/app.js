// Client id would be kept on server, foursquare does not let us have a demo account
'use strict'

var CLIENT_ID = "BKB4P410BCSDMNCUN1PZQ3WIKCEVF4X3YKG0P0S1KWCZMT0A";
// Client secret would be kept on server
var CLIENT_SECRET = "55SBXGG3SGTEANJGSA1CSTEFVSKZYICXNFUC55JP0KBU1XFI";
var version =  "v=20140806";

// https://api.foursquare.com/v2/venues/41706480f964a520a51d1fe3?client_id=BKB4P410BCSDMNCUN1PZQ3WIKCEVF4X3YKG0P0S1KWCZMT0A&client_secret=55SBXGG3SGTEANJGSA1CSTEFVSKZYICXNFUC55JP0KBU1XFI&v=20140806

// &client_id=CLIENT_ID&client_secret=CLIENT_SECRET

var ACTIVE_COLOR = 'white';
var INACTIVE_COLOR = 'grey';

var markers =  []; // our markers
var map;  // our google map
var elemBestMusuemsOfNYC; // need to change text color
var infowindow; // popup information window

// this is the location data for the app
var locations = [
    {  title: 'Museum of Modern Art', location: {lat: 40.7614327, lng: -73.9776216}, foursquareVenue : '4af5a46af964a520b5fa21e3'},
    {  title: 'Metropolitan Museum of Art', location: {lat: 40.7794366, lng: -73.963244}, foursquareVenue : '427c0500f964a52097211fe3'},
    {  title: 'New Museum', location: {lat: 40.7223376, lng: -73.9928905}, foursquareVenue : '4750accef964a520b24c1fe3'},
    {  title: 'Whitney Museum of American Art', location: {lat: 40.7395877, lng: -74.0088629}, foursquareVenue : '421a7600f964a5209d1f1fe3'},
    {  title: 'Solomon R. Guggenheim Museum', location: {lat: 40.7829796, lng: -73.9589706}, foursquareVenue : '41706480f964a520a51d1fe3'}
];
// this will hold the locations once they are converted
// to the knockout objects
var koLocations = [];

// this is my main binding for knockout
var mainPlacesToGo;

var bounds;


// this is called from onload of the window
// we need to startup google maps
function initMap() {
    var i, len;

      // this is to extend the map boundry in case the marker hits outside of map boundry
    bounds = new google.maps.LatLngBounds();

    var location = new google.maps.LatLng(40.7414327, -73.9776216);


    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: location,
        zoom: 12,
        panControl: false,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);

    var marker = new google.maps.Marker({
        map: map
    });

    var mapLocation, newMarker;

    infowindow = new google.maps.InfoWindow({
        maxWidth: 400
    });


    for (i = 0, len = locations.length; i < len; i++){
        // create the location as  a  ko thing
        // so we can fix the color

        mapLocation = new koLocation(locations[i]);
        //Get the position from the location array
        //Create a marker per location, and put into markers array
        newMarker = new google.maps.Marker({
            map: map,
            position: mapLocation.location.location,
            title: mapLocation.title,
            animation: google.maps.Animation.DROP,
            id: i
        });
         bounds.extend(newMarker.position);
         markers.push( newMarker );

         koLocations.push(mapLocation);

        // now set up a click listener for each musuem link
        mapLocation.marker = newMarker;
        newMarker.location = mapLocation;

        // we add a google maps marker listener click event
        setupLinkAndMarkerListener( mapLocation , newMarker, infowindow );
    }

    var styles = [
                    {"featureType": "landscape",
                        "stylers": [{"saturation": -100},
                            {"lightness": 65}, {"visibility": "on"}]},
                                {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];

    map.set('styles', styles);

    // setup the select all which is the element in the upper right
    elemBestMusuemsOfNYC = document.getElementById("BestMusuemsOfNYC");
    elemBestMusuemsOfNYC.style.color =  ACTIVE_COLOR;
    elemBestMusuemsOfNYC.addEventListener('click', function() {
            hideMusuems();
            clearTheLastActiveLink();
            showMusuems();
            elemBestMusuemsOfNYC.style.color =  ACTIVE_COLOR;
            infowindow.close();
    });

    // create the main ko class
    mainPlacesToGo = new placesToGo();
    // and bind the main class
    ko.applyBindings( mainPlacesToGo );

    // show all the museums markers
    showMusuems();

    // handle search text
    var e = document.getElementById('searchBox');
    e.oninput =  function() {
        var e = document.getElementById('searchBox');
        var s = e.value;
        s = s.toLowerCase(); // couldn't find it this is why
        var searchResults = [];
        var location;
        var i, len;
        if  (s.length === 0 ) {
            // clear box every things is displayed
            // mainPlacesToGo searchResults when updated
            // magically updates screen
            for ( i = 0, len = koLocations.length; i < len; i++ ) {
                location = koLocations[i];
                searchResults.push( location );
            }
            mainPlacesToGo.searchResults( searchResults );
        } else {
            // look for things that have what ever s has in  it
            // mainPlacesToGo searchResults when updated
            // magically updates screen
            for ( i = 0, len = koLocations.length; i < len; i++ ) {
                location = koLocations[i];
                if  (location.title.toLowerCase().search( s ) >= 0 ) {
                    searchResults.push( location );
                }
            }
            // by resetting the search results
            // ko magically updates the screen
            mainPlacesToGo.searchResults( searchResults );
        }
    };
    e.onpropertychange = e.oninput; // for IE8
}

// we  need this location  so we can set up color as
// observable.  which means when we call color(something)
// the html for that item will update hopefully
function koLocation(location) {
    var self = this;
    self.location = location;
    self.color =  ko.observable( INACTIVE_COLOR );
    self.title = location.title;
    self.marker = location.marker;
}

// make our places to go list for knockout
function placesToGo() {
    var self = this;
    var i, len;
    self.placesToGo = koLocations;

    // gotoPlace will be our click handle for knockout
    self.gotoPlace = function(location) {
        showMapPoint( location , infowindow);
    };

    var results = [];
    for ( i = 0 , len = koLocations.length; i < len ; i++ ) {
        results.push( koLocations[i]  );
    }
    self.searchResults = ko.observable( results );
}

// hide all the musuems
function hideMusuems(location) {
    var i, len;
    for (i = 0, len = locations.length; i < len; i++){
        var loc = koLocations[i];
        if ( loc === koLocations ) {
            continue;
        }
        loc.marker.setMap(null);
    }
}

// show all the musuems
function showMusuems() {
    //Extend the boundaries of the map for each marker and display the marker
    var i, len, marker;
    for (i = 0, len = koLocations.length; i < len; i++){
        marker = koLocations[i].marker;
        marker.setMap(map);
        bounds.extend(marker.position);
        bounceMarker(marker);
    }
    map.fitBounds(bounds);
    setTimeout( function() {
        var i, len, marker;
        for (var i = 0, len = koLocations.length; i < len ; i++){
            marker = koLocations[i].marker;
            bounceMarker(marker);
        }
     }, 300 );
 }

// show one musuem selected and zoom
// in on it
function showOneMusuem( location ) {
    var marker =  location.marker;
    bounds.extend(marker.position);
    map.fitBounds(bounds);
    map.setZoom(17);
    map.panTo(marker.position);
    marker.setMap( map );
    bounceMarker(marker);
    // this hides the search results!
    document.getElementById('searchBox').blur();
}

function bounceMarker(marker)
{
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout( function() { bounceMarker(marker); } , 800 );
    }
}

var lastActiveLink = undefined;

// we can use ko to set the color
// property to change colors.
function clearTheLastActiveLink() {
    if ( lastActiveLink ) {
        lastActiveLink.color( INACTIVE_COLOR );
    }
    // var  elem= document.getElementById("Musuem"+lastActiveLink)
    // elem.style.color =  INACTIVE_COLOR;
    // clear the select all
    elemBestMusuemsOfNYC.style.color =  INACTIVE_COLOR;
}

function showMapPoint( location , infoWindow) {
    hideMusuems(location);
    clearTheLastActiveLink();
    location.color( ACTIVE_COLOR );
    lastActiveLink =  location ;
    showOneMusuem( location );
    populateInfoWindow( location.marker , infoWindow);
}

function setupLinkAndMarkerListener( location , newMarker, infoWindow ) {
    location.color(INACTIVE_COLOR);
   //Create an onclick event to open an infowindow at each marker
   newMarker.addListener('click', function() {
            showMapPoint( location , infoWindow);
    });
}

function loadFoursquareInfoMarker(  location  ) {
    var request = "https://api.foursquare.com/v2/venues/"+location.location.foursquareVenue;
    request +=  "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20140806";
    // example from W3C School to get data
    // http://www.w3schools.com/xml/tryit.asp?filename=try_dom_xmlhttprequest_first
    var xmlhttp;
    if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
    } else {
            // code for older browsers
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            // 4 means request finished
            if (this.readyState == 4 ) {
                var failure = true;
                if ( this.status == 200) {
                    // console.log( this.responseText );
                    var response = JSON.parse( this.responseText );
                    // make sure we have some thing
                    if ( response && response.response.venue ) {
                        var venue = response.response.venue;
                        var description = venue.description ? venue.description : "";
                        failure = false;
                        console.log( venue );
                        location.foursquareInfo = '<div>'+
                        '<img src="'+venue.bestPhoto.prefix+'200x100'+venue.bestPhoto.suffix+'"/>'+
                        '<p>'+
                        '<a href="'+venue.url+'">'+venue.name+'</a>'+
                        '<p>'+description+'</p>'+
                        '<a href="'+venue.shortUrl+'">Foursquare Page</a>'+
                        "</div>";
                        if ( infowindow.marker === location.marker ) {
                            infowindow.setContent(location.foursquareInfo );
                        }
                    }
                }

                // failure??
                if ( failure ) {
                    if ( infowindow.marker === location.marker ) {
                        infowindow.setContent('<div>' + "Error loading info for " + location.marker.title + "..." + '</div>');
                    }
                }
            }
    };
    xmlhttp.open("GET", request, true);
    xmlhttp.send();
}

var lastOpenTimer = undefined;
// This function populates the infowindo when the marker is clicked.
// There will be only one infowindow opening at the  marker when the marker is clicked.
function populateInfoWindow(marker, infowindow) {
    //check to make sure the infowindow is not already opened on this marker
    if (infowindow.marker = marker) {
        infowindow.marker = marker;
        if ( marker.location.foursquareInfo ) {
            infowindow.setContent(marker.location.foursquareInfo);
        } else {
            infowindow.setContent('<div>' + "Loading info for " + marker.title + "..." + '</div>');
            loadFoursquareInfoMarker(  marker.location );
        }
        if ( lastOpenTimer ) {
            clearTimeout( lastOpenTimer );
            lastOpenTimer = undefined;
        }
        lastOpenTimer = setTimeout( function() {
                    lastOpenTimer = undefined;
                    infowindow.open(map, marker);
                }, 500 );
        //Make sure the marker property is cleared if the infowindow is closed
        // infowindow.addListener('closeclick',function(){
        //     // infowindow.setMarker(null); we are closed by the x
        // });
    }
}

function errorGoogleMapsNotLoaded() {
    alert("Unable to load google maps.  Please click OK and then try to refresh page!");
}



// google.maps.event.addDomListener(window, 'load', initMap);


