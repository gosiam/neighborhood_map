$(function () {

    var markers;


    function initMap() {

        var location = new google.maps.LatLng(40.7614327, -73.9776216);

        var locations = [
          {title: 'Museum of Modern Art', location: {lat: 40.7614327, lng: -73.9776216,}},
          {title: 'Metropolitan Museum of Art', location: {lat: 40.7794366, lng: -73.963244,}},
          {title: 'New Museum', location: {lat: 40.7223376, lng: -73.9928905,}},
          {title: 'Whitney Museum of American Art', location: {lat: 40.7395877, lng: -74.0088629,}},
          {title: 'Solomon R. Guggenheim Museum', location: {lat: 40.7829796, lng: -73.9589706,}},
        ];

        var contentStrings =
        [
             '<div class="info-window">' +
                '<h3>Museum of Modern Art</h3>' +
                '<div class="info-content">' +
                '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>' +
                '</div>' +
                '</div>',
             '<div class="info-window">' +
                '<h3>Metropolitan Museum of Art</h3>' +
                '<div class="info-content">' +
                '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>' +
                '</div>' +
                '</div>',
             '<div class="info-window">' +
                '<h3>New Museum</h3>' +
                '<div class="info-content">' +
                '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>' +
                '</div>' +
                '</div>',
             '<div class="info-window">' +
                '<h3>Solomon R. Guggenheim Museum</h3>' +
                '<div class="info-content">' +
                '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>' +
                '</div>' +
                '</div>',
             '<div class="info-window">' +
                '<h3>Whitney Museum of American Art</h3>' +
                '<div class="info-content">' +
                '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>' +
                '</div>' +
                '</div>' 
        ];
        var markers =  [];

        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: location,
            zoom: 12,
            panControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);
          // this is to extend the map boundry in case the marker hits outside of map boundry
        var bounds = new google.maps.LatLngBounds();

        var markerImage = 'images/marker.png';

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: markerImage
        });

        var infowindow = new google.maps.InfoWindow({
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
            //Create an onclick event to open an infowindow at each marker
            newMarker.addListener('click', function() {
                populateInfoWindow(this, infowindow);
            });

            // now set up a click listener for each musuem link
            setupLinkListener( i, newMarker, infowindow );
        }

       

           //This funciton will loop through the markers array and display them all
         //This funciton will loop through the listings and hide them all
    
        // for ( var i = 0 ,  infowindow , len = contentStrings.length ; i < len ;  i++ ) {
        

        //     markers[i].addListener('click', function () {
        //         infowindow.open( map, marker[i]);
        //     });
        // }

        var styles = [{"featureType": "landscape", 
                        "stylers": [{"saturation": -100}, 
                                {"lightness": 65}, {"visibility": "on"}]}, 
                                {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];

        map.set('styles', styles);
        showMusuems();


        function hideMusuems() {
            for (var i = 0; i < markers.length; i++){
                markers[i].setMap(null);
            }
        }

      function showMusuems() {
        var bounds = new google.maps.LatLngBounds();
        //Extend the boundaries of the map for each marker and display the marker
            for (var i = 0; i < markers.length; i++){
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
            }
            map.fitBounds(bounds);
        }
    }

    var lastActiveLink = 0;
    function clearTheLastActiveLink() {
        let elem= document.getElementById("Musuem"+lastActiveLink)
        elem.style.color = 'rgb(128,128,128)';
    }

    function setupLinkListener( index, newMarker, infoWindow ) {
        let elem= document.getElementById("Musuem"+index)
        elem.style.color = 'rgb(128,128,128)';
        elem.addEventListener('click', function() {
                elem.style.color = 'rgb(255,255,255)';
                clearTheLastActiveLink();
                lastActiveLink =  index;
                populateInfoWindow( newMarker, infoWindow);
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
                infowindow.setMarker(null);
            });
        }
    }


    google.maps.event.addDomListener(window, 'load', initMap);
});

