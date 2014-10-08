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

// graph
e.graph({method: 'DFS'}); // returns the entity's graph using the Depth First Search algorithm
e.graph({method: 'BFS'}); // returns the entity's graph using the Breadth First Search algorithm

// entity edit, save, delete
e.edit({age: 32}); //sets the entity's age attribute to 32 (triggers the change event)
e.save(); //saves the changes to the database (currently, it is not needed to save the changes as the cache feature, and server-side storage are not implemented)
e.delete(); // deletes the entity from the database
```
Index-free Adjacency `Graph.Edge`
----------
As is fundamental to Graph data models, graph.js implements Index-free Adjacency. That means rather than linking entities via an index value and requiring the use of a 'JOIN' to join the information about two or more entities, each `Graph.Entity` stores a `Graph.Collection` collection of its relationships other relationships including a direct reference to the other entity. Since the collection of edges is a `Graph.Collection` object, it has the same methods for sorting, filtering and iterating listed above in the `Graph.Collection` section.  
  
The `Graph.Edge` object contains atrributes to store a direct reference the other entity, the relationship, and the type on edge (incoming or outgoing).
```javascript  
var edges = testDB.query().first().edges(); //returns a Graph.Collection of the Grpah.Edge objects

var ed = edges.first(); // returns the first Graph.Edge object in the collection

ed.entity; // returns the other Graph.Entity object
ed.rel; // returns the relationship info
ed.type; // returns the edge type (incoming or outgoing)
```
The View Controller `Graph.Dashboard`
----------
The `Graph.Dashboard` view-controller is responsible for rendering the `Graph.Component` views, binding to the data object, and calling component event handlers in response to data object events.  
  
The `Graph.Dashboard` has methods for adding layouts, binding to a data object, handling data object events.
```javascript
// creating new dashboard with default layout
// a layout is an object with array of rows
//   a row is an array of collums
//
// the class attribute of the rows and collumns allows for users to define the css class(es) to be included in the row & collumn markup when rendered
var dashboard = new Graph.Dashboard({database: testDB, container: $('#main'), layout: {
  rows: [{
    class: 'row',
    cols: [{
      class: 'col-md-12 col-s-12',
      component: d3_tree
    }]
  },{
    class: 'row',
    cols: [{
      class: 'col-md-8 col-s-12',
      component: person_template
    },{
      class: 'col-md-4 col-s-12',
      component: friendslist
    }]
  }]
}});

//adding adittional layouts 
// method params @name, @filterData, @layout
dashboard.addLayout('place', {type: 'place'}, {
  rows: [{
    class: 'row',
    cols: [{
      class: 'col-md-12 col-s-12',
      component: d3_tree
    }]
  },{
    class: 'row',
    cols: [{
      class: 'col-md-8 col-s-12',
      component: Graph.Component.extend({})
    }]
  }]
});

//binding to data object will render the layout that matches the layout filterData with the data object attributes
dashboard.bind(testDB.query().filter({name: 'Tom' }).first());
```
The View `Graph.Component`
----------
The `Graph.Component` view is what actually displays the data in the browser. It is extended rather than instatiated like the other `Graph` objects. By default, the `Graph.Component` simply displays all the names of the data object attributes, followed by the value.  
  
To create custom components, extend the `Graph.Component` object via the `.extend()` method. This will allow for creation of components that render only certain data object attributes, describe data object relationships by traversing its graph, or even render a graph/tree to display that data object's graph. This is where graph.js really gets custom.
```javascript
// create a basic component to display all the data object attribute value, except for the attribute 'image'
//   which will render an html img tag and set its src attribute to the data object's 'image' attribute value. 
var person_template = Graph.Component.extend({
  name: 'dude_gen',
  render: function(obj){
    var _$output = $('<div class="graph_component" id="graph_component_dude_gen"/>');
    for (var i in obj.entity()){
      switch(i){
        case 'image':
            _$output.prepend('<img src="' + obj[i] + '" class="mugshot"/>');
            break;
        default:
            _$output.append(i+': <span class="graph_component_' + this.name + '" id="graph_component_' + this.name + '_' + i + '">' + obj[i] + ' </span><br/>');
      }
    }
    return _$output; 
  },
  events: {
    onchange: function(changes){
      for (var i = 0, len = changes.length; i < len; i++)
        $('span#graph_component_dude_gen_' + changes[i].property).text(changes[i].newValue); 
    }
  }
});
```
  
  A more complex custom component can be seen in the `/example/components/d3_tree.js` file.
