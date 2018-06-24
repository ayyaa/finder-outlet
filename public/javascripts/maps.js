function initMap() {

  var locations = !{data}

  console.log(locations)

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -7.7842584, lng: 110.3875498},
    zoom: 15
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

  var marker, i;

  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map,
      url: locations[i][4],
      title: 'Outlet : '+locations[i][0],
    });

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infoWindow.setContent(locations[i][0]);
        window.location.href = this.url;
      }
    })(marker, i));

    //- google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
    //-   return function () {
    //-     infoWindow.setContent(locations[i][0]);
    //-     //- window.location.href = this.url;
    //-   }
    //- })(marker, i));

  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(pos)
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
  }  
}