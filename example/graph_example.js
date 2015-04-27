var startData = {
  entities : [
    { name: "Tom", type: "person", age: "28", image: "http://img3.wikia.nocookie.net/__cb20120329233907/alcatraztv/images/2/22/2002_mugshot.jpg"},
    { name: "Bob", type: "person", image: "http://images.amcnetworks.com/blogs.amctv.com/wp-content/uploads/2010/04/Krazy-8-Mugshot-760.jpg"},
    { name: "Tom\'s house", type: "place", location: "1234 1st St"},
    { name: "Tom\'s motorcycle", type: "thing", brand: "Honda"}
    ], 
  edges : [
    { source: 'person_Tom', target: 'place_Tom\'s house', rel: "lives at"},
    { source: 'place_Tom\'s house', target: 'person_Tom', rel: "residence of"},
    { source: 'person_Bob', target: 'place_Tom\'s house', rel: "painted"},
    { source: 'person_Tom', target: 'person_Bob', rel: 'knows'}  
]};

//test construtor 
var testDB = new Graph.Database({
    cache: 'testData', 
    datasource: startData, 
    index: function(obj){
        return obj.type + '_' + obj.name;
    }
}); 
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
dashboard.bind(testDB.query().filter({name: 'Tom' }).first());
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
