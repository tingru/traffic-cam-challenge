// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

function onReady() {
    var mapOptions = {
        center: { lat: 47.6, lng: -122.3 },
        zoom: 12
    };

    var mapElem = document.getElementById('map');

    //create the map
    var map = new google.maps.Map(mapElem, mapOptions);
    var cameraInfoWindow = new google.maps.InfoWindow();

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function (data) {
            //success: data contains parsed JavaScript data
            _.forEach(data, function (camera) {
                console.log("camera: " + camera);

                var position = {
                    lat: Number(camera.location.latitude),
                    lng: Number(camera.location.longitude)
                };
                //create a marker on the map
                var image = 'img/uw-marker.png'
                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    icon: image
                });

                //listen for click event on marker
                google.maps.event.addListener(marker, 'click', function () {
                    map.panTo(marker.getPosition());
                    var html = '<p>' + camera.cameralabel + '</p>';
                    html += '<img src="' + camera.imageurl.url + '"/>';

                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    window.setTimeout(function () {
                        marker.setAnimation(null);
                    }, 2000);

                    cameraInfoWindow.setContent(html);

                    //open it on the map, anchored to a marker
                    cameraInfoWindow.open(map, marker);
                })

                $("#search").bind("search keyup", function () {
                    console.log("searching: " + this.value);
                    if (camera.cameralabel.toLowerCase().indexOf(this.value.toLowerCase()) < 0) {
                        //remove marker from the map
                        marker.setMap(null);
                    } else {
                        //marker still exists in memory and can be added to the
                        //map again by calling setMap passing a valid map
                        marker.setMap(map);
                    }
                });

            });
        })
        .fail(function (error) {
            //error contains error information
            alert(error);
        })
        .always(function () {
            //just like finally() from Angular
            //called on either success or error cases
        });

    // resize based on the browser's height
    onResize();
    $(window).resize(onResize);

    function onResize() {
        var mapDiv = $('#map');
        var rightHeight = $(window).height() - mapDiv.position().top - 20;
        mapDiv.css('height', rightHeight);
    }

    google.maps.event.addListener(map, 'click', function () {
        cameraInfoWindow.close();
    });
}

$(document).ready(onReady);