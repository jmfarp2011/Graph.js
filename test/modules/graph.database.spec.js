describe('Graph.js Database object', function(){
    beforeEach(function(){
        this.ds = {
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
        this.emptyDatabase = new Graph.Database();
        this.testDatabase = new Graph.Database({
            datasource: this.ds,
            index: function(obj){
                return obj.type + obj.name;
            }
        });
    });

    afterEach(function(){
        this.emptyDatabase = null;
        this.testDatabase = null;
        delete this.emptyDatabase;
        delete this.testDatabase;
    });

    describe('initialization', function(){
        it('should not be null or undefined', function(){
            expect(Graph.Database).not.toBe(null);
            expect(Graph.Database).toBeDefined();
        });

        it('should initialize', function(){
            expect(this.testDatabase).toBeDefined();
            expect(this.testDatabase.query() instanceof Graph.Collection).toBe(true);
        });
    });

    describe('methods', function(){
        it('should generate an index', function(){
            expect(this.testDatabase.index(this.ds.entities[0])).toEqual('personTom');
            this.ds.entities[0].id = '1';
            expect(this.emptyDatabase.index(this.ds.entities[0])).toEqual('1');
        });

        it('should add an entity', function(){
            //should start with an empty dataset if empty
            this.ds.entities[0].id = '1';
            expect(this.emptyDatabase.query().length).toBe(0);

            this.ds.entities[1].id = '2';
            this.emptyDatabase.add(this.ds.entities[0]);
            expect(this.emptyDatabase.query().length).toBe(1);

            this.ds.entities[2].id = '3';
            this.emptyDatabase.add(this.ds.entities[1]);
            expect(this.emptyDatabase.query().length).toBe(2);
        });

        it('should query entities', function(){
            this.ds.entities[0].cid = this.testDatabase.index(this.ds.entities[0]);
            this.ds.entities[1].cid = this.testDatabase.index(this.ds.entities[1]);

            //blank query returns full dataset as a Graph.Collection object
            expect(this.testDatabase.query() instanceof Graph.Collection).toBe(true);
            expect(this.testDatabase.query().filter({cid: 'personTom'}).length).toBe(1);
            expect(this.testDatabase.query().filter({cid: 'personTom'}).first() instanceof Graph.Entity).toEqual(true);

            //query with filter obj returns a filtered dataset as a Graph.Collection object
            expect(this.testDatabase.query({cid: 'personBob'}) instanceof Graph.Collection).toBe(true);
            expect(this.testDatabase.query({cid: 'personBob'}).length).toBe(1);
            expect(this.testDatabase.query({cid: 'personBob'}).first().entity()).toEqual(this.ds.entities[1]);
        });

        it('should ingest a datasource', function(){
            var ds = {
                entities : [
                    { id: '1', name: "Tom", type: "person", age: "28", image: "http://img3.wikia.nocookie.net/__cb20120329233907/alcatraztv/images/2/22/2002_mugshot.jpg"},
                    { id: '2', name: "Bob", type: "person", image: "http://images.amcnetworks.com/blogs.amctv.com/wp-content/uploads/2010/04/Krazy-8-Mugshot-760.jpg"},
                    { id: '3', name: "Tom\'s house", type: "place", location: "1234 1st St"},
                    { id: '4', name: "Tomsmotorcycle", type: "thing", brand: "Honda"}
                ], 
                edges : [
                    { source: '1', target: '3', rel: "lives at"},
                    { source: '3', target: '1', rel: "residence of"},
                    { source: '2', target: '3', rel: "painted"},
                    { source: '1', target: '2', rel: 'knows'}  
                ]};
            this.emptyDatabase.ingest(ds);

            expect(this.emptyDatabase.query().data.length).toEqual(this.ds.entities.length);
            expect(this.emptyDatabase.query({cid: '1'}).data[0].edges().length).toEqual(3);
        });
        
        it('should ingest a graph', function(){
            var graph = {
                id: '1', 
                name: "Tom", 
                type: "person", 
                age: "28", 
                image: "http://img3.wikia.nocookie.net/__cb20120329233907/alcatraztv/images/2/22/2002_mugshot.jpg", 
                edges: [{
                    edge: {type: 'out', rel: 'knows'},
                    id: '2', 
                    name: "Bob", 
                    type: "person", 
                    image: "http://images.amcnetworks.com/blogs.amctv.com/wp-content/uploads/2010/04/Krazy-8-Mugshot-760.jpg"
                },{
                    edge: {type: 'out', rel: 'lives at'},
                    id: '3', 
                    name: "Tom\'s house", 
                    type: "place", 
                    location: "1234 1st St",
                    edges: [{
                        edge: {type: 'in', rel: 'painted'},
                        id: '2',
                    }]
                },{
                    edge: {type: 'in', rel: 'owned by'},
                    id: '4', 
                    name: "Tomsmotorcycle", 
                    type: "thing", 
                    brand: "Honda"
                }]
            };
            
            this.emptyDatabase.ingestGraph(graph);
            
            expect(this.emptyDatabase.query().data.length).toEqual(4);
            expect(this.emptyDatabase.query({cid: '1'}).data[0].edges().length).toEqual(3);
        });

        it('should update an entity', function(){
            this.testDatabase.update('personTom', {age: 25});
            expect(this.testDatabase.query({cid: 'personTom'}).first().entity().age).toEqual(25);
        });

        it('should remove an entity', function(){
            this.testDatabase.remove('personTom');
            expect(this.testDatabase.query({id: "personTom"}).length).toEqual(0);
        });

        it('should link two entities', function(){
            this.testDatabase.link('personBob', 'personTom', 'friends with'); 
            expect(this.testDatabase.query({cid: 'personBob'}).first().edges().filter({entity__cid__is: 'personTom'}).length).toBe(2);
        });
    });


    describe('events', function(){
        it('should handle "change" events', function(){       
            var result,
                tom = this.testDatabase.query({cid: 'personTom'}).first(),
                bob = this.testDatabase.query({cid: 'personBob'}).first();

            this.testDatabase.on('change', function(event, changes){
                result = changes;
            });

            tom.edit({name: 'Tommy'});        
            expect(result).toEqual([{property: 'name', oldValue: 'Tom', newValue: 'Tommy'}]); 

            bob.edit({name: 'Bobby'});
            expect(result).toEqual([{property: 'name', oldValue: 'Bob', newValue: 'Bobby'}]);

            this.testDatabase.on('change', function(event, changes){
                result = changes;
            }, 'personTom');

            tom.edit({name: 'Tommy Lee'});
            expect(result).toEqual([{property: 'name', oldValue: 'Tommy', newValue: 'Tommy Lee'}]); 
        });

        it('should handle "addedge" events', function(){
            var result,
                tom = this.testDatabase.query({cid: 'personTom'}).first(),
                bob = this.testDatabase.query({cid: 'personBob'}).first(),
                moto = this.testDatabase.query({cid: 'thingTom\'s motorcycle'}).first();

            this.testDatabase.on('addedge', function(event, data){
                result = data;
            });

            bob.link({
                entity: tom,
                rel: 'friend',
                type: 'in'
            });

            expect(result.entity).toEqual(bob);
            expect(result.edge.entity).toEqual(tom);

            this.testDatabase.on('addedge', function(event, data){
                result = data;
            }, 'personTom');

            tom.link({
                entity: moto,
                rel: 'owns',
                type: 'in'
            });

            expect(result.entity).toEqual(tom);
            expect(result.edge.entity).toEqual(moto);

        });
    });
    
/*    it('should handle mass data', function(){
        var name,
            maxLen = Math.pow(2, 16),
            maxLen = Math.pow(2, 4);
        for (var i = 0; i < maxLen; i++){
            name = 'entity'+ i;
            this.emptyDatabase.add({
                id: i,
                name: name
            });
        }
    });
*/
});