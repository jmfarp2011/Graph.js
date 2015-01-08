describe('Graph.js Collection object', function(){
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
    
    it('should allow instantiation', function(){
        expect(this.testCollection.data).not.toBe(null);
        expect(this.testCollection.data).toBeDefined();
    });
    
    it('should allow adding items', function(){
        
    });
    
    it('should allow removing items', function(){
        
    });
    
    it('should allow filtering items', function(){
        
    });
    
    it('should allow sorting items', function(){
        
    });
    
    it('should allow iterating items', function(){
        
    });    
});