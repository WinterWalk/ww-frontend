var polylineCoordinates = [];
var myLatlng = {lat: 45.393776, lng: -75.683198};
var map;

var myStyles =[
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    }
];

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
    }

function recenter_map (lat_lng) {
    map.panTo(lat_lng);
}

function draw_polyline (coords, colorCode) {

    let colorHex;
    switch(colorCode){
    case 3:
        colorHex = '#FF0000'
        break
    case 2:
        colorHex = '#FFA500'
        break
    case 1:
        colorHex = '#FFA500'
        break
    default:
        colorHex = '#000000'
    }


    var polyline = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: colorHex,
        strokeOpacity: 1,
        strokeWeight: 4,
      });
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


