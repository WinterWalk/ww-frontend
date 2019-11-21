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