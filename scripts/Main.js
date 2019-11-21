'use strict';

var collection_name = 'streets'

var select_mun = document.getElementById("municipality");
var select_str = document.getElementById("street");
var select_fro = document.getElementById("from");
var select_to = document.getElementById("to");

var query_data = [];

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
  filters_temp['from'] = '';
  filters_temp['to'] = '';
};


//function to update form
function update_form(){

    console.log(filters_temp)

    var filtered_data = WinterWalk.prototype.getFilteredRestaurants(filters_temp)

    var temp_street = [];
    var temp_from= [];
    var temp_to = [];

    filtered_data.then(
      function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            query_data.push( doc );

            // push values to arrays
            if ( !(temp_street.includes(doc.ROAD_NAME_FULL)) ){
              temp_street.push( doc.ROAD_NAME_FULL )
            }

            if ( !(temp_from.includes(doc.TO_ROAD_NAME)) ){
              temp_from.push( doc.TO_RD_NAME )
            }

             if ( !(temp_to.includes(doc.TO_ROAD_NAME)) ){
              temp_to.push( doc.TO_RD_NAME )
            }

            // sort arrays
            temp_street.sort()
            temp_from.sort()
            temp_to.sort()

            // add to selects
            temp_street.forEach(function(entry) {
              select_str.options[select_str.options.length] = new Option(entry, entry);
            });

            temp_from.forEach(function(entry) {
              select_fro.options[select_fro.options.length] = new Option(entry, entry);
            });

            temp_to.forEach(function(entry) {
              select_to.options[select_to.options.length] = new Option(entry, entry);
            });
        });
      }
    )
    console.log(temp_street.length)
    console.log(temp_from.length)
    console.log(temp_to.length)
};

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
  window.app = new WinterWalk();

  var filtered_data = this.WinterWalk.prototype.getFilteredRestaurants(filters_temp)

  var temp_municipality = [];

  // initialize municipality
  filtered_data.then(
        function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              query_data.push( doc );

              // add municipality
              if ( !(temp_municipality.includes(doc.MUNICIPALITY)) ){
                // add to dropdown list
                temp_municipality.push( doc.MUNICIPALITY )
                select_mun.options[select_mun.options.length] = new Option(doc.MUNICIPALITY, doc.MUNICIPALITY);
              }
          });
        }
  )
  
  // // add data
    // //  var collection = firebase.firestore().collection('restaurants');
    // //  return collection.add(rest_data);

};

window.addEventListener('load', function () {
  
  // listener for municipality
  select_mun.addEventListener("change", function() {

    if ( this.value !== 'na' ){
      filters_temp['municipality'] = this.value
      update_form()
    } else {
      //clear dropdown
      clear_dropdown(select_str)
      clear_dropdown(select_fro)
      clear_dropdown(select_to)
      //add default option
      select_str.options[select_str.options.length] = new Option('Select one', 'na');
      select_fro.options[select_fro.options.length] = new Option('Select one', 'na');
      select_to.options[select_fro.options.length] = new Option('Select one', 'na');
    }

  });
  
  // listener for street
  select_str.addEventListener("change", function() {
   
    if ( this.value !== 'na' ){
      filters_temp['street'] = this.value
      update_form()
    } else {
      //clear dropdown
      clear_dropdown(select_fro)
      clear_dropdown(select_to)
      //add default option
      select_fro.options[select_fro.options.length] = new Option('Select one', 'na');
      select_to.options[select_fro.options.length] = new Option('Select one', 'na');
    }

  });

  // listener for from
  select_fro.addEventListener("change", function() {
   
    if ( this.value !== 'na' ){
      filters_temp['from'] = this.value
      update_form()
    } else {
      //clear dropdown
      clear_dropdown(select_to)
      //add default option
      select_to.options[select_fro.options.length] = new Option('Select one', 'na');
    }


  });

}, false);
