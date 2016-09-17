$(function () {

    // Client id would be kept on server, foursquare does not let us have a demo account

    var CLIENT_ID = "BKB4P410BCSDMNCUN1PZQ3WIKCEVF4X3YKG0P0S1KWCZMT0A"
    // Client secret would be kept on server
    var CLIENT_SECRET = "55SBXGG3SGTEANJGSA1CSTEFVSKZYICXNFUC55JP0KBU1XFI"
    var version =  "v=20140806"

    // https://api.foursquare.com/v2/venues/41706480f964a520a51d1fe3?client_id=BKB4P410BCSDMNCUN1PZQ3WIKCEVF4X3YKG0P0S1KWCZMT0A&client_secret=55SBXGG3SGTEANJGSA1CSTEFVSKZYICXNFUC55JP0KBU1XFI&v=20140806

    // &client_id=CLIENT_ID&client_secret=CLIENT_SECRET

    var ACTIVE_COLOR = 'white';
    var INACTIVE_COLOR = 'grey';

    var markers =  []; // our markers
    var map ;  // our google map 
    var elemBestMusuemsOfNYC; // need to change text color 
    var infowindow ; // popup information window 

    function initMap() {

        var location = new google.maps.LatLng(40.7414327, -73.9776216);

        var locations = [
          {title: 'Museum of Modern Art', location: {lat: 40.7614327, lng: -73.9776216,} , foursquareVenue : '4af5a46af964a520b5fa21e3'},
          {title: 'Metropolitan Museum of Art', location: {lat: 40.7794366, lng: -73.963244,} , foursquareVenue : '427c0500f964a52097211fe3'},
          {title: 'New Museum', location: {lat: 40.7223376, lng: -73.9928905,}, foursquareVenue : '4750accef964a520b24c1fe3'},
          {title: 'Whitney Museum of American Art', location: {lat: 40.7395877, lng: -74.0088629,}, foursquareVenue : '421a7600f964a5209d1f1fe3'},
          {title: 'Solomon R. Guggenheim Museum', location: {lat: 40.7829796, lng: -73.9589706,}, foursquareVenue : '41706480f964a520a51d1fe3'},
        ];

        

        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: location,
            zoom: 12,
            panControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(mapCanvas, mapOptions);
          // this is to extend the map boundry in case the marker hits outside of map boundry
        var bounds = new google.maps.LatLngBounds();

        var markerImage = 'images/marker.png';

        var marker = new google.maps.Marker({
            map: map,
            // if we need marker image remove commen    icon: markerImage
        });

        infowindow = new google.maps.InfoWindow({
            maxWidth: 400
        });


        for (var i = 0, len = locations.length ; i < len; i++){
            //Get the position from the location array
            //Create a marker per location, and put into markers array
            var newMarker = new google.maps.Marker({
                map: map,
                position: locations[i].location,
                title: locations[i].title,
                animation: google.maps.Animation.DROP,
                id: i
            });
             bounds.extend(newMarker.position);
             markers.push( newMarker );

            // now set up a click listener for each musuem link
            setupLinkAndMarkerListener( i, newMarker, infowindow );
        }

        var styles = [{"featureType": "landscape", 
                        "stylers": [{"saturation": -100}, 
                                {"lightness": 65}, {"visibility": "on"}]}, 
                                {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];

        map.set('styles', styles);

        // setup the select all 
        elemBestMusuemsOfNYC = document.getElementById("BestMusuemsOfNYC");
        elemBestMusuemsOfNYC.style.color =  ACTIVE_COLOR;
        elemBestMusuemsOfNYC.addEventListener('click', function() {
                hideMusuems();
                clearTheLastActiveLink();
                showMusuems();
                elemBestMusuemsOfNYC.style.color =  ACTIVE_COLOR;
                infowindow.close();
        });
        
        showMusuems();

    }


    function hideMusuems(exceptThisOne) {
        for (var i = 0; i < markers.length; i++){
            if ( i === exceptThisOne ) {
                continue;
            }
            markers[i].setMap(null);
        }
    }

   var bounds = new google.maps.LatLngBounds();

   function showMusuems() {
        //Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++){
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    function showOneMusuem( index ) {
        var marker = markers[index];
        marker.setMap(map);
        bounds.extend(marker.position);
        map.fitBounds(bounds);
        map.setZoom(17);
        map.panTo(marker.position);
    }

    var lastActiveLink = 0;
    function clearTheLastActiveLink() {
        var  elem= document.getElementById("Musuem"+lastActiveLink)
        elem.style.color =  INACTIVE_COLOR;
        // clear the select all 
        elemBestMusuemsOfNYC.style.color =  INACTIVE_COLOR;
    }

    function showMapPoint(index,newMarker, infoWindow) {
        var  elem= document.getElementById("Musuem"+index)
        hideMusuems(index);
        clearTheLastActiveLink();
        elem.style.color =  ACTIVE_COLOR;
        lastActiveLink =  index;
        showOneMusuem(index);
        populateInfoWindow( newMarker, infoWindow);
    }

    function setupLinkAndMarkerListener( index, newMarker, infoWindow ) {
        var  elem= document.getElementById("Musuem"+index)
        elem.style.color = INACTIVE_COLOR;
        elem.addEventListener('click', function() {
                showMapPoint(index,  newMarker, infoWindow);
        });
       //Create an onclick event to open an infowindow at each marker
       newMarker.addListener('click', function() {
                showMapPoint(index,  newMarker, infoWindow);
        });
    }

    // This function populates the infowindo when the marker is clicked.
    // There will be only one infowindow opening at the  marker when the marker is clicked.
    function populateInfoWindow(marker, infowindow) {
        //check to make sure the infowindow is not already opened on this marker
        if (infowindow.marker = marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            //Makre sure the marker property is cleared if the infowindow is closed
            infowindow.addListener('closeclick',function(){
                // infowindow.setMarker(null); we are closed by the x 
            });
        }
    }



    google.maps.event.addDomListener(window, 'load', initMap);
});

