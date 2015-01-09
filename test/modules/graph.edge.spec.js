describe('Graph.js Edge object', function(){
    it('should not be null or undefined', function(){
        expect(Graph.Edge).not.toBe(null);
        expect(Graph.Edge).toBeDefined();
    });
    
    var testEdge;
    it('should initialize', function(){
        testEdge = new Graph.Edge({
            entity: 'test',
            rel: 'test relation',
            type: 'in'
        });
        expect(testEdge).toBeDefined();
    });
    
    it('should store egde attributes', function(){
        expect(testEdge.entity).toBeDefined();
        expect(testEdge.entity).toBe('test');
        
        expect(testEdge.rel).toBeDefined();
        expect(testEdge.rel).toBe('test relation');
                
        expect(testEdge.type).toBeDefined();
        expect(testEdge.type).toBe('in');        
    });
});