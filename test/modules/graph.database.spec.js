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
    });

    afterEach(function(){
        this.testDatabase = null;
    });
    
    it('should initialize', function(){
        
    });
    
    //values
    //None
    
    //methods    
    it('should ingest a datasource', function(){
        
    });
    
    it('should generate an index', function(){
        
    });
    
    it('should add an entity', function(){
        
    });
    
    it('should query entities', function(){
        
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