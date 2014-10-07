Graph.js
========

####Graph.js is a MVC-like framework for building web applications using the graph data model
**Model/Collection:** The framework consists of a graph-based, client-side database `Graph.Database` that holds a `Graph.Collection` collection of `Graph.Entity` models. Those models also hold a `Graph.Collections` collection of their `Graph.Edge` edges via index-free adjacency.

**View/Control:** The framework also controls the display of that data with it's `Graph.Dashboard` view-controler. The `Graph.Dashboard` view-controller controls the rendering and updating a collection of  extensible `Graph.Component` views.

####ToDo:
+ Implement Cache via localStorage or indexDB

The Database `Graph.Database`
----------

```javascript  
//define starting datasource
var startData = {
  entities : [
    { name: "Tom", type: "person", age: "28", image: "http://img3.wikia.nocookie.net/__cb20120329233907/alcatraztv/images/2/22/2002_mugshot.jpg"},
    { name: "Bob", type: "person", image: "http://images.amcnetworks.com/blogs.amctv.com/wp-content/uploads/2010/04/Krazy-8-Mugshot-760.jpg"},
    { name: "Tom\'s house", type: "place", location: "1234 1st St"},
    { name: "Tom\'s motorcycle", type: "thing", brand: "Honda"}
    ], 
  edges : [
    { source: '6ccf636aa68475c9711fe80cc6595339ab5b093c', target: '0093a56270a68bcfc2acfe8b253c81b646a2c3f2', rel: "lives at"},
    { source: '0093a56270a68bcfc2acfe8b253c81b646a2c3f2', target: '6ccf636aa68475c9711fe80cc6595339ab5b093c', rel: "residence of"},
    { source: '23a8f91a975089e7ccd2229674a6dcad51fbd42f', target: '0093a56270a68bcfc2acfe8b253c81b646a2c3f2', rel: "painted"},
    { source: '6ccf636aa68475c9711fe80cc6595339ab5b093c', target: '23a8f91a975089e7ccd2229674a6dcad51fbd42f', rel: 'knows'}
]};

//construct database and intialize with the datasource
var testDB = new Graph.Database({cache: 'testData', datasource: startData});
```
The Collection `Graph.Collection`
----------
On instantiation, the `Graph.Database` object creates a `Graph.Collection` collection of entities. Use the `Graph.Database.query()` method to return a `Graph.Collection` object containiner all the entities in the database.  
  
The `Graph.Collection` object has methods for filtering and sorting items by key values, and iterating through the entities contained in the collection.
```javascript  
// querying data starts with the Graph.Database.query() method
var q = testDB.query(); // returns a Graph.Collection object containing all the entities in the database

//sorting
q.sort('name'); // sorts the collection by the name attribute

// iterations
q.first(); // returns the first in the sorted collection entity (Bob)
q.hasNext(); // returns boolean value reflecting whether the collection has more entities to return
q.next(); // returns the next entity in the collection (Tom)
q.last(); // returns the last entity in the collection (Tom's motorcycle)

// filtering
q.filter({type: 'person'}); // returns a new Graph.Collection object containing all entities matching the filter criteria
q.filter({age__gt: 28}); // returns a new Graph.Collection object containing all the entities with an age attribute greater than 28

// method chaining
testDB.query()
  .sort('name')
  .filter({type: 'person'})
  .first();
```
The Model `Graph.Entity`
----------
The `Graph.Entity` object is the main data stored and processed by the graph.js framework. Each entity has atrributes, or information stored about the entity, and a `Graph.Collection` collection of its relationships `Graph.Edge` with other entities.  

The `Graph.Entity` object has methods for editing its attributes and edges, as well as saving the changes to or deleting the entity from the database. It also has methods for subscribing to events, and rendering the entity's graph, or map of its relationships with other entities.
```javascript  
var e = testDB.query().first(); // returns the first entity in the collection. Alternatively, use the .filter() method to select a desired entity by it's attributes


// event handling
e.on('change', function(event, changes){
  for (var c in changes)
    console.log(changes.property + ' changed from ' + changes.oldValue + ' to ' + changes.newValue); 
});

e.on('addnewedge', function(event, data){
  console.log('Entity ' + data.entity + ' has new edge ' + data.edge.rel + ' with ' + data.edge.entity.name);
});

// entity edit, save, delete
e.edit({age: 32}); //sets the entity's age attribute to 32 (triggers the change event)
e.save(); //saves the changes to the database (currently, it is not needed to save the changes as the cache feature, and server-side storage are not implemented)
e.delete(); // deletes the entity from the database
```
Index-free Adjacency `Graph.Edge`
----------

```javascript  

```
The View Controller `Graph.Dashboard`
----------

```javascript  

```
The View `Graph.Component`
----------

```javascript  

```
