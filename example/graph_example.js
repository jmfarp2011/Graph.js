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

//test construtor 
var testDB = new Graph.Database({cache: 'testData', datasource: startData}); 
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
