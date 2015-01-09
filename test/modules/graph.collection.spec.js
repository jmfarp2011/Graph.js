describe('Graph.js Collection object', function(){
    //init
    it('should not be null or undefined', function(){
        expect(Graph.Collection).not.toBe(null);
        expect(Graph.Collection).toBeDefined();
    });
    
    beforeEach(function(){
        this.testCollection = new Graph.Collection({
            db: function(){
                    return new Graph.Database({
                        datasource: {
                            entities: [],
                            edges: []
                        }
                    });
                }
            },
            []);
    });
    
    afterEach(function(){
        this.testCollection = null;
    });
    
    it('should initialize', function(){
        expect(this.testCollection.data).not.toBe(null);
        expect(this.testCollection.data).toBeDefined();
    });
    
    //values
    it('should calculate length', function(){
        
    });
    
    it('should return data as array', function(){
        
    });
    
    //methods
    it('should add items', function(){
        
    });
    
    it('should remove item', function(){
        
    });
    
    it('should filter items', function(){
        
    });
    
    it('should sort items', function(){
        
    });
    
    it('should iterate items', function(){
        
    });
    
    //events
    //None
});