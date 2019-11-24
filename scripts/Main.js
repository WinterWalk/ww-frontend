'use strict';

var collection_name = 'streets'

var select_mun = document.getElementById("municipality");
var select_str = document.getElementById("street");
var select_bet = document.getElementById("between");

var div_str = document.getElementById("street_div");
var div_bet = document.getElementById("between_div");
var div_but = document.getElementById("submit_button");

var div_cond = document.getElementById("condition");

var query_data = [];

var polylines_coord = [];

var condition = 0;


// read initial streets
var filters_temp = {
  municipality: 'Old Ottawa',
  street: '',
  from: '',
  to: ''
};

//function to clear dropdown
function clear_dropdown(comboBox) {
  while (comboBox.options.length > 0) {                
      comboBox.remove(0);
  }
};

function clear_filter() {
  filters_temp['municipality'] = '';
  filters_temp['street'] = '';
};

function draw_selected_line () {

  filters_temp['municipality'] = select_mun.value
    filters_temp['street'] = select_str.value
    var array_temp = select_bet.value.split(" and ")
    filters_temp['from'] = array_temp[0]
    filters_temp['to'] = array_temp[1]

    query_data = streets_db
    query_data = query_data.filter(obj => (obj.MUNICIPALITY===filters_temp.municipality))
    query_data = query_data.filter(obj => (obj.ROAD_NAME_FULL===filters_temp.street))
    query_data = query_data.filter(obj => (obj.FROM_RD_NAME===filters_temp.from))
    query_data = query_data.filter(obj => (obj.TO_RD_NAME===filters_temp.to))
    
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
    draw_polyline(coords)

}

function reset_form() {

  clear_dropdown(select_str)
  clear_dropdown(select_bet)

  select_str.options[select_str.options.length] = new Option('Select one', '');
  select_bet.options[select_bet.options.length] = new Option('Select one', '');

  var temp_municipality = [];

  query_data = streets_db
  // initialize municipality
    query_data.forEach(function(doc) {
      // add municipality
      if ( !(temp_municipality.includes(doc.MUNICIPALITY)) ){
        // add to dropdown list
        temp_municipality.push( doc.MUNICIPALITY )
      }
    });
    temp_municipality.sort()

    temp_municipality = temp_municipality.filter(x => !!x)
    
    temp_municipality.forEach(function(entry) {
      select_mun.options[select_mun.options.length] = new Option(entry, entry);
    });


}


//function to update form
function update_form(obj_listener){

  query_data = streets_db   
    // var filtered_data = WinterWalk.prototype.getFilteredRestaurants(filters_temp)

    if (filters_temp.municipality !== ''){
      query_data = query_data.filter(obj => (obj.MUNICIPALITY===filters_temp.municipality  ) )
    }

    if (filters_temp.street !== ''){
      query_data = query_data.filter(obj => (obj.ROAD_NAME_FULL===filters_temp.street  ) )
      clear_dropdown(select_bet)
    }

    console.log(query_data.length)
    //console.log(query_data)

    var temp_street = []; 
    var temp_bet= [];

    query_data.forEach(function(doc) {

        // push values to arrays
        if ( !(temp_street.includes(doc.ROAD_NAME_FULL)) ){
          temp_street.push( doc.ROAD_NAME_FULL )
        }

        if ( !(temp_bet.includes(doc.FROM_RD_NAME + ' and ' + doc.TO_RD_NAME)) ){
          temp_bet.push( doc.FROM_RD_NAME + ' and ' + doc.TO_RD_NAME)
        }
    });

    // sort arrays
    temp_street.sort()
    temp_bet.sort()

    //clear for blanks
    temp_street = temp_street.filter(x => !!x)
    temp_bet = temp_bet.filter(x => !!x)

    if (obj_listener == 'municipality') {

      clear_dropdown(select_str)
      clear_dropdown(select_bet)

      select_str.options[select_str.options.length] = new Option('Select one', '');
      select_bet.options[select_bet.options.length] = new Option('Select one', '');

      // add to selects
      temp_street.forEach(function(entry) {
        select_str.options[select_str.options.length] = new Option(entry, entry);
      });
    

      temp_bet.forEach(function(entry) {
        select_bet.options[select_bet.options.length] = new Option(entry, entry);
      });
    }

    if (obj_listener == 'street') {

      clear_dropdown(select_bet)

      select_bet.options[select_bet.options.length] = new Option('Select one', '');

      temp_bet.forEach(function(entry) {
        select_bet.options[select_bet.options.length] = new Option(entry, entry);
      });
    }
    
  }

/**
 * Initializes the WinterWalk app.
 */
function WinterWalk() {

  this.filters = {
    municipality: 'Old Ottawa',
    street: '',
    from: '',
    to: ''
  };

  var that = this;
  //var select = that.templates["municipality"];

  firebase.auth().signInAnonymously().then(function() {
    
    that.initRouter();
    that.initTemplates();

    }).catch(function(err) {
      console.log(err);
    });
}

/**
 * Initializes the router for the FriendlyEats app.
 */
WinterWalk.prototype.initRouter = function() {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      '/': function() {
        //that.updateQuery(that.filters);
        that.getFilteredRestaurants(that.filters);
      }
    })
    .resolve();

  // firebase
  //   .firestore()
  //   .collection('streets')
  //   .limit(1)
  //   .onSnapshot(function(snapshot) {
  //     // if (snapshot.empty) {
  //     //   that.router.navigate('/setup');
  //     // }
  //   });
};

WinterWalk.prototype.initTemplates = function() {
  this.templates = {};

  var that = this;
  document.querySelectorAll('.template').forEach(function(el) {
    that.templates[el.getAttribute('id')] = el;
  });
};

window.onload = function() {
  // window.app = new WinterWalk();

  div_str.style.display = 'none';
  div_bet.style.display = 'none';

  // var filtered_data = this.WinterWalk.prototype.getFilteredRestaurants(filters_temp)

  reset_form();
  

  // // add data
    // //  var collection = firebase.firestore().collection('restaurants');
    // //  return collection.add(rest_data);

};

window.addEventListener('load', function () {
  
  // listener for municipality
  select_mun.addEventListener("change", function() {

    if ( this.value !== '' ){
      filters_temp['municipality'] = this.value
      filters_temp['street'] = ''
      update_form('municipality')

      div_str.style.display = 'inline';
      div_bet.style.display = 'none';
      div_but.style.display = 'none';
      div_cond.style.display = 'none';

    } else {
      //clear dropdown
      clear_dropdown(select_str)
      clear_dropdown(select_bet)
      //add default option
      select_str.options[select_str.options.length] = new Option('Select one', '');
      select_bet.options[select_bet.options.length] = new Option('Select one', '');

      div_str.style.display = 'none';
      div_bet.style.display = 'none';
      div_but.style.display = 'none';
      div_cond.style.display = 'none';

    }

  });
  
  // listener for street
  select_str.addEventListener("change", function() {
   
    if ( this.value !== '' ){
      filters_temp['street'] = this.value
      update_form('street')

      div_bet.style.display = 'inline';
      div_but.style.display = 'none';
      div_cond.style.display = 'none';
      
    } else {
      //clear dropdown
      clear_dropdown(select_bet)
      //add default option
      select_bet.options[select_bet.options.length] = new Option('Select one', '');

      div_bet.style.display = 'none';
      div_but.style.display = 'none';
      div_cond.style.display = 'none';
    }

  });

  // listener for between
  select_bet.addEventListener("change", function() {
   
    if ( this.value !== '' ){

      // delete polylines
      erase_polyline('black');

      div_but.style.display = 'inline';
      div_cond.style.display = 'inline';

      //select radio safe
      document.getElementById("safe_rd").checked = true;

      draw_selected_line();
      
    } else {
      
      erase_polyline('black');

      div_but.style.display = 'none';
      div_cond.style.display = 'none';

    }

  });

  // listener for button
  div_but.addEventListener("click", function() {

    // get radio and check  values
    var radios = document.getElementsByName('cond');
    for(var i = 0; i < radios.length; i++){
        if (radios[i].checked == true) {
            condition = radios[i].value;
        }
    }

    console.log(query_data[0].RD_SEGMENT_ID)

    console.log(condition)


  });

}, false);
