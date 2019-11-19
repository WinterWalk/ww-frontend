'use strict';

var collection_name = 'streets'

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

  firebase.auth().signInAnonymously().then(function() {
    
    that.initRouter();

    
   // // test all streets
   // that.getAllRestaurants()

   var filtered_data = that.getFilteredRestaurants(that.filters)

   filtered_data.then(
       function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
             console.log('filtered')
             console.log(doc.ROAD_NAME_FULL)
             console.log(doc.COORD)
         });
     })

    // // query one restaurant
    // var filtered_doc = that.getRestaurant("00T6XmnXpLUtG5MQKvl0")

    // filtered_doc.then(function(result){

    //   console.log('before')
    //   console.log(result.id);
    //   console.log(result.ROAD_NAME_FULL);

    // });


    // query filtered


    // // add data
    // var rest_data = {
    //     name: 'Gui',
    //     category: 'test',
    //     price: '9',
    //     city: 'Porto Alegre'
    // };

    // // add data
    // //  var collection = firebase.firestore().collection('restaurants');
    // //  return collection.add(rest_data);

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
      }
    })
    .resolve();

  firebase
    .firestore()
    .collection('streets')
    .limit(1)
    .onSnapshot(function(snapshot) {
      // if (snapshot.empty) {
      //   that.router.navigate('/setup');
      // }
    });
};

window.onload = function() {
  window.app = new WinterWalk();
};
