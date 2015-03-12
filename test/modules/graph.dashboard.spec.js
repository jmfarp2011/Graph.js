jasmine.getFixtures().fixturesPath = 'test/fixtures';

describe('Graph.js Dashboard object', function(){

    beforeEach(function(){        
        var ds = {
            entities : [
                { name: "Tom", type: "person", age: "28", image: "http://img3.wikia.nocookie.net/__cb20120329233907/alcatraztv/images/2/22/2002_mugshot.jpg"},
                { name: "Bob", type: "person", image: "http://images.amcnetworks.com/blogs.amctv.com/wp-content/uploads/2010/04/Krazy-8-Mugshot-760.jpg"},
                { name: "Tom\'s house", type: "place", location: "1234 1st St"},
                { name: "Tom\'s motorcycle", type: "thing", brand: "Honda"}
            ], 
            edges : [
                { source: 'personTom', target: 'placeTom\'s house', rel: "lives at"},
                { source: 'placeTom\'s house', target: 'personTom', rel: "residence of"},
                { source: 'personBob', target: 'placeTom\'s house', rel: "painted"},
                { source: 'personTom', target: 'personBob', rel: 'knows'}  
            ]};
        this.db = new Graph.Database({
            datasource: ds,
            index: function(obj){
                return obj.type + obj.name;
            }
        });

        var c = $('<div id="container" />').appendTo($('body'));
        this.testDashboard = new Graph.Dashboard({
            container: c, 
            database: this.db
        });
    });

    afterEach(function(){
        this.testDashboard = null;
        c = null;
        this.db = null;
    });

    describe('initialization', function(){
        it('should not be null or undefined', function(){
            expect(Graph.Dashboard).not.toBe(null);
            expect(Graph.Dashboard).toBeDefined();
        });

        it('should be an instance of Graph.Database', function(){
            expect(this.testDashboard instanceof Graph.Dashboard).toBe(true);            
        });

        it('should error if not passed required options(container & database)', function(){
            expect( function(){ new Graph.Dashboard(); }).toThrow(new Error("No options supplied."));
            expect( function(){ new Graph.Dashboard( {} ); }).toThrow(new Error("No options.container supplied."));

            var c2 = $('<div id="c2" />').appendTo($('body'));
            expect( function(){ new Graph.Dashboard({ container: c2 }); }).toThrow(new Error("No options.database supplied."));

            var db = this.db;
            expect( function(){ new Graph.Dashboard( { container: c2, database: db } ); }).not.toThrow();
        });

        it('should add "graph_dashboard" class to container', function(){
            expect($('#container')).toHaveClass("graph_dashboard");
        });
    });

    describe('binding to an entity', function(){
        it('should bind to given entity', function(){
            this.testDashboard.bind(this.db.query({name: 'Tom'}).first());
            expect($('#graph_component_base_name')).toHaveClass('graph_component_base');
            expect($('#graph_component_base_name')).toContainText('Tom');
            expect($('#graph_component_base_type')).toContainText('person');
            expect($('#graph_component_base_age')).toContainText('28');
        });

        it('should bind to a entity by a given filter object', function(){
            this.testDashboard.bindFirst({name: 'Tom'});
            expect($('#graph_component_base_name')).toHaveClass('graph_component_base');
            expect($('#graph_component_base_name')).toContainText('Tom');
            expect($('#graph_component_base_type')).toContainText('person');
            expect($('#graph_component_base_age')).toContainText('28');
        });
    });

    describe('layout management', function(){
        it('should add a layout', function(){
            this.testDashboard.addLayout('Person', {type: 'person'}, {
                rows: [{
                    cssClass: '',
                    cols: [{
                        cssClass: '',
                        component: Graph.Component.extend({name: 'person'})
                    }]
                }]
            });
            this.testDashboard.bindFirst({name: 'Tom'});
            expect($('#graph_component_person_name')).toHaveClass('graph_component_person');
            expect($('#graph_component_person_name')).toContainText('Tom');
            expect($('#graph_component_person_type')).toContainText('person');
            expect($('#graph_component_person_age')).toContainText('28');
        });
    });

    describe('event handling', function(){
        it('should handle onchange event', function(){

        });
        
        it('should handle onaddedge event', function(){

        });
    });
});