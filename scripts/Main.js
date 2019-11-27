'use strict';

// variables to show lines and dashed lines (in minutes)
var max_time_limit = 24*60
var dash_time_limit = 3

var select_str = document.getElementById("street");
var input_str = document.getElementById("input_str");

var select_bet = document.getElementById("between");
var input_bet = document.getElementById("input_bet");


var div_str = document.getElementById("street_div");
var div_bet = document.getElementById("between_div");
var div_cond = document.getElementById("condition");
var div_but = document.getElementById("submit_button");
var div_refresh = document.getElementById("refresh_info");


var query_data = [];

var polylines_coord = [];
var polylines_conditions = [];

var db_result = [];

var condition = 0;



//function to clear dropdown
function clear_dropdown(inputBox, datalist) {

  var list_size = datalist.children.length

  //remove options
  for (var i = 0, len_i = list_size; i < len_i; i++) {
    datalist.children[0].remove()
  }
  
  // clear input box
  inputBox.value = ''
};

function reset_form() {

  clear_dropdown(input_bet, select_bet)


  var temp_streets = [];

  query_data = streets_db
  // initialize municipality
    query_data.forEach(function(doc) {
      if ( !(temp_streets.includes(doc.ROAD_NAME_FULL)) ){
        temp_streets.push( doc.ROAD_NAME_FULL )
      }
    });
    temp_streets.sort()

    temp_streets = temp_streets.filter(x => !!x)
    
    
    temp_streets.forEach(function(entry) {
      //populate streets
      var option = document.createElement('option');
      option.value = entry;
      select_str.appendChild(option);
    });
}

function onInput_str() {

    var val = input_str.value;
  
    //look for a street
    var query_data = streets_db 
    query_data = query_data.filter(obj => (obj.ROAD_NAME_FULL===val))
  
  
    if ( query_data.length > 0 ){
      
      var temp_between = [];
  
      // update between datalist
      query_data.forEach(function(doc) {
        if ( !(temp_between.includes(doc.FROM_RD_NAME + " and " + doc.TO_RD_NAME)) ){
          temp_between.push( doc.FROM_RD_NAME + " and " + doc.TO_RD_NAME )
        }
      });
      temp_between.sort()
  
      temp_between = temp_between.filter(x => !!x)
      
      
      temp_between.forEach(function(entry) {
        //populate streets
        var option = document.createElement('option');
        option.value = entry;
        select_bet.appendChild(option);
      });
      
  
      div_bet.style.display = 'inline';
      div_but.style.display = 'none';
      div_cond.style.display = 'none';
      
    } else {
      //clear dropdown
      clear_dropdown(input_bet, select_bet)
      //add default option
      div_bet.style.display = 'none';
      div_but.style.display = 'none';
      div_cond.style.display = 'none';
    }
  }
  
function onInput_bet() {
  
    var val = input_bet.value;
  
    var temp_street = input_str.value
  
    if (val.includes(" and ") > 0 ){
  
      var array_temp = val.split(" and ")
      var temp_from = array_temp[0]
      var temp_to = array_temp[1]
  
  
      //look for a street
      var query_data = streets_db 
      query_data = query_data.filter(obj => (obj.ROAD_NAME_FULL===temp_street))
      query_data = query_data.filter(obj => (obj.FROM_RD_NAME===temp_from))
      query_data = query_data.filter(obj => (obj.TO_RD_NAME===temp_to))
  
      
      if ( query_data.length > 0 ){
  
          // delete polylines
          erase_polyline('black');
      
          div_but.style.display = 'inline';
          div_cond.style.display = 'inline';
      
          //select radio safe
          document.getElementById("safe_rd").checked = true;
      
          draw_selected_line(query_data);
          
      } else {
          
          erase_polyline('black');
      
          div_but.style.display = 'none';
          div_cond.style.display = 'none';
      
      }
  
    }
  
  }


window.onload = function() {
    //window.app = new WinterWalk();
  
    div_bet.style.display = 'none';
    div_but.style.display = 'none';
    div_cond.style.display = 'none';
  
    reset_form();
  
    var temp_test = query_all_data('conditions', max_time_limit)
  
    temp_test.then(function(){
      console.log(db_result);
      draw_condition_lines(db_result, dash_time_limit);
      }
    )
  };
  
window.addEventListener('load', function () {
  
    //window.app = new WinterWalk();
  
  
    // listener for button
    div_but.addEventListener("click", function() {
  
      // get radio and check  values
      var radios = document.getElementsByName('cond');
      for(var i = 0; i < radios.length; i++){
          if (radios[i].checked == true) {
              condition = radios[i].value;
          }
      }
  
      //get current RD_SEGMENT_ID
      var temp_between = input_bet.value;
      var temp_street = input_str.value
  
      var array_temp = temp_between.split(" and ")
      var temp_from = array_temp[0]
      var temp_to = array_temp[1]
  
      var query_data = streets_db 
      query_data = query_data.filter(obj => (obj.ROAD_NAME_FULL===temp_street))
      query_data = query_data.filter(obj => (obj.FROM_RD_NAME===temp_from))
      query_data = query_data.filter(obj => (obj.TO_RD_NAME===temp_to))
  
  
      // build data and add to db
      var temp_condition = {RD_SEGMENT_ID: query_data[0].RD_SEGMENT_ID,
                            CONDITION: condition,
                            TIMESTAMP: new Date().getTime()
                           }
        
      add_data_to_DB ('conditions', temp_condition)
  
      // erase black line
      erase_polyline('black');

      //clear dropdown
      input_str.value = ''
      clear_dropdown(input_bet, select_bet)
      div_bet.style.display = 'none';
      div_but.style.display = 'none';
      div_cond.style.display = 'none';
  
      // refresh view
      var temp_test = query_all_data('conditions', max_time_limit)
                           
      db_result = [];
  
      temp_test.then(function(){
        console.log(db_result);
        draw_condition_lines(db_result, dash_time_limit);
        }
      )
      
    });
  
  
     // listener for refresh button
     div_refresh.addEventListener("click", function() {
  
  
      //clear dropdown
      input_str.value = ''
      clear_dropdown(input_bet, select_bet)
      
  
      div_bet.style.display = 'none';
      div_but.style.display = 'none';
      div_cond.style.display = 'none';
  
      // erase black line
      erase_polyline('black');
  
      // refresh view
      var temp_test = query_all_data('conditions', max_time_limit)
  
      db_result = [];
  
      temp_test.then(function(){
        console.log(db_result);
        draw_condition_lines(db_result, dash_time_limit);
        }
      )
  
    });
  
  }, false);
  

// function draw_selected_line (query_data) {

//     //recenter and draw line
//     var selected_coord = query_data[0].COORD.split(" ")
//     var first_latlng = selected_coord[0].split(",")
//     var myLatlng = {lat: parseFloat(first_latlng[1]), lng: parseFloat(first_latlng[0])};
//     var coords = []

//     query_data.forEach(function(entry) {
//       var curr_coord = entry.COORD.split(" ")
//       curr_coord.forEach(function(entry) {
//         var first_latlng = entry.split(",")
//         coords.push( {lat: parseFloat(first_latlng[1]), lng: parseFloat(first_latlng[0])} )
//       })
//     });
    
//     polylines_coord.push(coords);

//     recenter_map(myLatlng)
//     draw_polyline(coords, 5)

// }

// function draw_condition_lines (array_temp) {

//   var temp_now = new Date().getTime();

//   for (var i = 0, len_i = array_temp.length; i < len_i; i++) {
    
//     var id = array_temp[i].RD_SEGMENT_ID
//     var condition = parseInt(array_temp[i].CONDITION)
//     var timestamp = array_temp[i].TIMESTAMP
  
//     //get coordinates
//     query_data = streets_db
//     query_data = query_data.filter(obj => (obj.RD_SEGMENT_ID===id))


//     //recenter and draw line
//     var coords = []

//     for (var j = 0, len_j = query_data.length; j < len_j; j++) {

//       var curr_coord = query_data[j].COORD.split(" ")

//       for (var k = 0, len_k = curr_coord.length; k < len_k; k++) {
//         var first_latlng = curr_coord[k].split(",")
//         coords.push( {lat: parseFloat(first_latlng[1]), lng: parseFloat(first_latlng[0])} )
//       }
//     }

     
//     polylines_conditions.push(coords);
   
//     var elapsed_time_min = Math.floor((temp_now - timestamp)/60000)

//     //choose to show a line as solid or dashed
//     if (elapsed_time_min < dash_time_limit) {
//       draw_polyline(coords, condition, 'solid');
//     } else {
//       draw_polyline(coords, condition, 'dashed');
//     }
    
//   }
// }

// function add_data_to_DB (db_name, data) {

//   firebase.auth().signInAnonymously().then(function() {
    
//     var collection = firebase.firestore().collection(db_name);
//     return collection.add(data);

//   }).catch(function(err) {
//     console.log(err);
//   });

// }

// function query_all_data (db_name) {

//   var temp_now = new Date().getTime();
//   var result = [];
//   var query = firebase.firestore().collection(db_name);

//   // filter according to max_time_limit
//   var filter_temp = 
//   query = query.where('TIMESTAMP', '>', (temp_now - max_time_limit));
  
//   // firebase.auth().signInAnonymously().then(function() {
//     return query
//     //.limit(5)
//     .get()
//     .then(
//       function(querySnapshot) {
//         querySnapshot.forEach(function(doc) {
//           result.push(doc.data())
//           db_result.push(doc.data())
//         });
//       return result
//     })
//   //});
// }




// /**
//  * Initializes the WinterWalk app.
//  */
// function WinterWalk() {

//   this.filters = {
//     municipality: 'Old Ottawa',
//     street: '',
//     from: '',
//     to: ''
//   };

//   var that = this;
//   //var select = that.templates["municipality"];

//   firebase.auth().signInAnonymously().then(function() {
    
//     that.initRouter();
//     that.initTemplates();

//     }).catch(function(err) {
//       console.log(err);
//     });
// }





// /**
//  * Initializes the router for the FriendlyEats app.
//  */
// WinterWalk.prototype.initRouter = function() {
//   this.router = new Navigo();

//   var that = this;
//   this.router
//     .on({
//       '/': function() {
//         //that.updateQuery(that.filters);
//         //that.getFilteredRestaurants(that.filters);
//       }
//     })
//     .resolve();
// };

// WinterWalk.prototype.initTemplates = function() {
//   this.templates = {};

//   var that = this;
//   document.querySelectorAll('.template').forEach(function(el) {
//     that.templates[el.getAttribute('id')] = el;
//   });
// };



// // read initial streets
// var filters_temp = {
//   municipality: 'Old Ottawa',
//   street: '',
//   from: '',
//   to: ''
// };


// //function to update form
// function update_form(obj_listener){

//   query_data = streets_db   

//     if (filters_temp.municipality !== ''){
//       query_data = query_data.filter(obj => (obj.MUNICIPALITY===filters_temp.municipality  ) )
//     }

//     if (filters_temp.street !== ''){
//       query_data = query_data.filter(obj => (obj.ROAD_NAME_FULL===filters_temp.street  ) )
//       clear_dropdown(input_bet, select_bet)
//     }

//     var temp_street = []; 
//     var temp_bet= [];

//     query_data.forEach(function(doc) {

//         // push values to arrays
//         if ( !(temp_street.includes(doc.ROAD_NAME_FULL)) ){
//           temp_street.push( doc.ROAD_NAME_FULL )
//         }

//         if ( !(temp_bet.includes(doc.FROM_RD_NAME + ' and ' + doc.TO_RD_NAME)) ){
//           temp_bet.push( doc.FROM_RD_NAME + ' and ' + doc.TO_RD_NAME)
//         }
//     });

//     // sort arrays
//     temp_street.sort()
//     temp_bet.sort()

//     //clear for blanks
//     temp_street = temp_street.filter(x => !!x)
//     temp_bet = temp_bet.filter(x => !!x)

//     if (obj_listener == 'municipality') {

//       //clear_dropdown(select_str)
//       //clear_dropdown(select_bet)

//       select_str.options[select_str.options.length] = new Option('Select one', '');
//       select_bet.options[select_bet.options.length] = new Option('Select one', '');

//       // add to selects
//       temp_street.forEach(function(entry) {
//         select_str.options[select_str.options.length] = new Option(entry, entry);
//       });
    

//       temp_bet.forEach(function(entry) {
//         select_bet.options[select_bet.options.length] = new Option(entry, entry);
//       });
//     }

//     if (obj_listener == 'street') {

//       //clear_dropdown(select_bet)

//       select_bet.options[select_bet.options.length] = new Option('Select one', '');

//       temp_bet.forEach(function(entry) {
//         select_bet.options[select_bet.options.length] = new Option(entry, entry);
//       });
//     }
    
//   }