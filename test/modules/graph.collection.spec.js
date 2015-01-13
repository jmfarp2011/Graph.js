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
                        },
                        indexGenerator: function(obj){
                            return obj.id;
                        }
                    });
                }
            },
            [{id: 1}, {id: 2}]);
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
        expect(this.testCollection.length).toBe(2);
    });
    
    it('should return data as array', function(){
       expect(this.testCollection.data instanceof Array).toBe(true); 
    });
    
    //methods
    it('should add items', function(){
        this.testCollection.add({id: 3});
        expect(this.testCollection.length).toBe(3);
    });
    
    it('should remove item', function(){
        this.testCollection.remove('2');
        expect(this.testCollection.length).toBe(1);        
    });
    
    it('should filter items', function(){
        expect(this.testCollection.filter({id: 1}).length).toBe(1);
    });
    
    it('should sort items', function(){
        //asc
        this.testCollection.sort('id');
        expect(this.testCollection.first().id).toBe(1);
        
        //desc
        this.testCollection.sort('id', true);
        expect(this.testCollection.first().id).toBe(2);
    });
    
    it('should iterate items', function(){
        //first
        expect(this.testCollection.first().id).toBe(1);
        expect(this.testCollection.hasNext()).toBe(true);
        
        //next
        expect(this.testCollection.next().id).toBe(2);
        expect(this.testCollection.hasNext()).toBe(false);
        
        //last
        this.testCollection.add({id: 3});
        expect(this.testCollection.hasNext()).toBe(true);
        expect(this.testCollection.last().id).toBe(3);
        expect(this.testCollection.hasNext()).toBe(false);
    });
    
    //events
    //None
});