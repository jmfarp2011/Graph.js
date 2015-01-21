describe('Graph.js Database object', function(){
    //init
    beforeEach(function(){
        this.ds = {
            entities : [
                { name: "Tom", type: "person", age: "28", image: "http://img3.wikia.nocookie.net/__cb20120329233907/alcatraztv/images/2/22/2002_mugshot.jpg"},
                { name: "Bob", type: "person", image: "http://images.amcnetworks.com/blogs.amctv.com/wp-content/uploads/2010/04/Krazy-8-Mugshot-760.jpg"},
                { name: "Tom\'s house", type: "place", location: "1234 1st St"},
                { name: "Tomsmotorcycle", type: "thing", brand: "Honda"}
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
    });
    
    it('should not be null or undefined', function(){
        expect(Graph.Database).not.toBe(null);
        expect(Graph.Database).toBeDefined();
    });

    it('should initialize', function(){
        expect(this.testDatabase).toBeDefined();
        expect(this.testDatabase.query() instanceof Graph.Collection).toBe(true);
    });

    //values
    //None

    //methods

    it('should generate an index', function(){
        expect(this.testDatabase.index(this.ds.entities[0])).toEqual('personTom');
        this.ds.entities[0].id = '1';
        expect(this.emptyDatabase.index(this.ds.entities[0])).toEqual('1');
    });

    it('should add an entity', function(){
        //should start with an empty dataset if empty
        this.ds.entities[0].id = '1';
        expect(this.emptyDatabase.query().length).toBe(0);
        
        this.emptyDatabase.add(this.ds.entities[0]);
        expect(this.emptyDatabase.query().length).toBe(1);
        
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

    it('should update an entity', function(){
        this.testDatabase.update('personTom', {age: 25});
        expect(this.testDatabase.query({cid: 'personTom'}).first().entity().age).toEqual(25);
    });

    it('should remove an entity', function(){
        this.testDatabase.remove('personTom');
        expect(this.testDatabase.query({id: "personTom"}).length).toEqual(0);
    });

    it('should link two entities', function(){

    });

    //events
    it('should handle "change" events', function(){

    });    

    it('should handle "addedge" events', function(){

    });    
});