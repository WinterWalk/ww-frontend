'use strict';

var collection_name = 'streets'

WinterWalk.prototype.addCondition = function(data) {
  var collection = firebase.firestore().collection(collection_name);
  return collection.add(data);
};

WinterWalk.prototype.getAllRows = function() {
  firebase.firestore()
  .collection(collection_name)
  .limit(5)
  .get()
  .then(
    function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          console.log('group')
          console.log(doc.id, " => ", doc.data());
      });
  })
};


WinterWalk.prototype.getRow = function(id) {
  return firebase.firestore()
  .collection(collection_name)
  .doc(id)
  .get()  
  .then(function(result){
    return { id, ...result.data() }
  })
};

WinterWalk.prototype.getFilteredRow = function(filters) {
 
var result = [];
var query = firebase.firestore().collection(collection_name);

 if (filters.municipality !== '') {
   query = query.where('MUNICIPALITY', '==', filters.municipality);
 }

 if (filters.street !== '') {
  query = query.where('ROAD_NAME_FULL', '==', filters.street);
 }

 if (filters.from !== '') {
   query = query.where('FROM_RD_NAME', '==', filters.from);
 }

 if (filters.to !== '') {
   query = query.where('TO_RD_NAME', '==', filters.to);
 }

return query.get().then(function(querySnapshot) {
            //console.log(querySnapshot)
            querySnapshot.forEach(function(doc) {
              //  console.log(doc.id, " => ", doc.data());
              result.push({ doc, ...doc.data() }); 
            })
          return result
        })
};
