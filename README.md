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
    { source: '23a8f91a975089e7ccd2229674a6dcad51fbd42f', target: '0093a56270a68bcfc2acfe8b253c81b646a2c3f2', rel: "painted"}
]};

//construct database and intialize with the datasource
var testDB = new Graph.Database({cache: 'testData', datasource: startData});
```
The Collection `Graph.Collection`
----------

```javascript  

```
The Model `Graph.Entity`
----------

```javascript  

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
