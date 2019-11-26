var polylineCoordinates = [];
var myLatlng = {lat: 45.393776, lng: -75.683198};
var map;

var myStyles =[
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            { visibility: "off"}
        ]
    }
];

var lineSymbol = {
    path: 'M 0,-2 0,1',
    strokeOpacity: 1,
    scale: 4
  };

function initMap() {
        
    linePath = new google.maps.Polyline({
          path: polylineCoordinates,
          geodesic: true,
          strokeColor: '#000000',
          strokeOpacity: 1.0,
          strokeWeight: 4
      });
                       
      // initialize map
      map = new google.maps.Map(document.getElementById('map'), {
          zoom: 17,
          center: myLatlng,
          styles: myStyles,
          disableDefaultUI: true
      });

    // get user location
            
  var infoWindow = new google.maps.InfoWindow;
             
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      var myLatlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
      };
      map.setCenter(myLatlng);
      
      }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
      });
  } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
  }

}



function recenter_map (lat_lng) {
    map.panTo(lat_lng);
}

function draw_polyline (coords, colorCode, style) {

    let colorHex;
    switch(colorCode){
    case 3:
        colorHex = '#F2113A'
        break
    case 2:
        colorHex = '#FFD66C'
        break
    case 1:
        colorHex = '#6EE9A6'
        break
    default:
        colorHex = '#000000'
    }

    if (style == 'dashed'){
        var polyline = new google.maps.Polyline({
            path: coords,
            geodesic: true,
            strokeColor: colorHex,
            strokeOpacity: 0,
            strokeWeight: 4,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
              }]
          });
    } else {
        var polyline = new google.maps.Polyline({
            path: coords,
            geodesic: true,
            strokeColor: colorHex,
            strokeOpacity: 1,
            strokeWeight: 4
          });
    }
    
      polylineCoordinates.push(polyline)
      polyline.setMap(map);
}


function erase_polyline(type) {

    if (type == 'black'){
        polylineCoordinates.forEach(function(doc) {
            if (doc.strokeColor == '#000000'){
                doc.setMap(null);
            }
        });
    } else {
        polylineCoordinates.forEach(function(doc) {
            doc.setMap(null);
        });
    } 
}


