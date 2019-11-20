'use strict';

var collection_name = 'streets'

var select_mun = document.getElementById("municipality");
var select_str = document.getElementById("street");
var select_fro = document.getElementById("from");
var select_to = document.getElementById("to");

var query_data = [];


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

  // read initial streets
  var filters_temp = {
    municipality: 'Old Ottawa',
    street: '',
    from: '',
    to: ''
  };

  var filtered_data = this.WinterWalk.prototype.getFilteredRestaurants(filters_temp)

  var temp_municipality = [];
  var temp_street = [];
  var temp_from = [];
  var temp_to = [];

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

              // add street
              if ( !(temp_street.includes(doc.ROAD_NAME_FULL)) ){
                // add to dropdown list
                temp_street.push( doc.ROAD_NAME_FULL )
                select_str.options[select_str.options.length] = new Option(doc.ROAD_NAME_FULL, doc.ROAD_NAME_FULL);
              }

              // add from
              if ( !(temp_from.includes(doc.FROM_ROAD_NAME)) ){
                // add to dropdown list
                temp_from.push( doc.FROM_RD_NAME )
                select_fro.options[select_fro.options.length] = new Option(doc.FROM_RD_NAME, doc.FROM_RD_NAME);
              }

              // add to
              if ( !(temp_to.includes(doc.TO_ROAD_NAME)) ){
                // add to dropdown list
                temp_to.push( doc.TO_RD_NAME )
                select_to.options[select_to.options.length] = new Option(doc.TO_RD_NAME, doc.TO_RD_NAME);
              }

          });
        }
  )
  
  // get unique municipality
  

  query_data.forEach(function(element) {
    
    
  });
  
  
    
  
  // // add data
    // //  var collection = firebase.firestore().collection('restaurants');
    // //  return collection.add(rest_data);

};
