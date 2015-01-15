describe('Graph.js Entity object', function(){
    //init
    it('should not be null or undefined', function(){
        expect(Graph.Dataabase).not.toBe(null);
        expect(Graph.Database).toBeDefined();
    });

    beforeEach(function(){
        this.testDatabase = new Graph.Database({
            datasource: {
                entities: [],
                edges: []
            },
            indexGenerator: function(obj){
                return obj.id;
            }
        });
        this.ds = {
            entities : [
                { id: '1', name: "Tom", type: "person", age: "28", image: "http://img3.wikia.nocookie.net/__cb20120329233907/alcatraztv/images/2/22/2002_mugshot.jpg"},
                { id: '2', name: "Bob", type: "person", image: "http://images.amcnetworks.com/blogs.amctv.com/wp-content/uploads/2010/04/Krazy-8-Mugshot-760.jpg"},
                { id: '3', name: "Tom\'s house", type: "place", location: "1234 1st St"},
                { id: '4', name: "Tom\'s motorcycle", type: "thing", brand: "Honda"}
            ], 
            edges : [
                { source: '1', target: '3', rel: "lives at"},
                { source: '3', target: '1', rel: "residence of"},
                { source: '2', target: '3', rel: "painted"},
                { source: '1', target: '2', rel: 'knows'}  
            ]};
    });

    afterEach(function(){
        this.testDatabase = null;
    });

    it('should initialize', function(){
        expect(this.testDatabase).toBeDefined();
        expect(this.testDatabase.query() instanceof Graph.Collection).toBe(true);
    });

    //values
    //None

    //methods

    it('should generate an index', function(){
        expect(this.testDatabase.index(this.ds.entities[0])).toEqual('1');
    });

    it('should add an entity', function(){
        //should start with an empty dataset
        expect(this.testDatabase.query().length).toBe(0);
        
        this.testDatabase.add(this.ds.entities[0]);
        expect(this.testDatabase.query().length).toBe(1);
        
        this.testDatabase.add(this.ds.entities[1]);
        expect(this.testDatabase.query().length).toBe(2);
    });

    it('should query entities', function(){
        this.testDatabase.add(this.ds.entities[0]);
        this.ds.entities[0].cid = this.testDatabase.index(this.ds.entities[0]);
        expect(this.testDatabase.query() instanceof Graph.Collection).toBe(true);
        expect(this.testDatabase.query().filter({cid: '1'}).first().entity()).toEqual(this.ds.entities[0]);
    });
    
    it('should ingest a datasource', function(){
        this.testDatabase.ingest(this.ds);
        
        expect(this.testDatabase.query().data.length).toEqual(this.ds.entities.length);
        expect(this.testDatabase.query().filter({cid: '1'}).data[0].edges().length).toEqual(3);
    });

    it('should update an entity', function(){

    });

    it('should remove an entity', function(){

    });

    it('should link two entities', function(){

    });

    //events
    it('should handle "change" events', function(){

    });    

    it('should handle "addedge" events', function(){

    });    
});