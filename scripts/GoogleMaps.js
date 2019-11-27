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
         // handleLocationError(true, infoWindow, map.getCenter());
      });
  } else {
      // Browser doesn't support Geolocation
      //handleLocationError(false, infoWindow, map.getCenter());
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


function draw_selected_line (query_data) {

    //recenter and draw line
    var selected_coord = query_data[0].COORD.split(" ")
    var first_latlng = selected_coord[0].split(",")
    var myLatlng = {lat: parseFloat(first_latlng[1]), lng: parseFloat(first_latlng[0])};
    var coords = []

    query_data.forEach(function(entry) {
      var curr_coord = entry.COORD.split(" ")
      curr_coord.forEach(function(entry) {
        var first_latlng = entry.split(",")
        coords.push( {lat: parseFloat(first_latlng[1]), lng: parseFloat(first_latlng[0])} )
      })
    });
    
    polylines_coord.push(coords);

    recenter_map(myLatlng)
    draw_polyline(coords, 5)

}

function draw_condition_lines (array_temp, dash_time_limit) {

  var temp_now = new Date().getTime();

  for (var i = 0, len_i = array_temp.length; i < len_i; i++) {
    
    var id = array_temp[i].RD_SEGMENT_ID
    var condition = parseInt(array_temp[i].CONDITION)
    var timestamp = array_temp[i].TIMESTAMP
  
    //get coordinates
    query_data = streets_db
    query_data = query_data.filter(obj => (obj.RD_SEGMENT_ID===id))


    //recenter and draw line
    var coords = []

    for (var j = 0, len_j = query_data.length; j < len_j; j++) {

      var curr_coord = query_data[j].COORD.split(" ")

      for (var k = 0, len_k = curr_coord.length; k < len_k; k++) {
        var first_latlng = curr_coord[k].split(",")
        coords.push( {lat: parseFloat(first_latlng[1]), lng: parseFloat(first_latlng[0])} )
      }
    }

     
    polylines_conditions.push(coords);
   
    var elapsed_time_min = Math.floor((temp_now - timestamp)/60000)

    //choose to show a line as solid or dashed
    if (elapsed_time_min < dash_time_limit) {
      draw_polyline(coords, condition, 'solid');
    } else {
      draw_polyline(coords, condition, 'dashed');
    }
    
  }
}


