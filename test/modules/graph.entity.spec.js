describe('Graph.js Entity object', function(){
    //init
    it('should not be null or undefined', function(){
        expect(Graph.Edge).not.toBe(null);
        expect(Graph.Edge).toBeDefined();
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
        this.testObj = {cid: 1, name: 'Tom', age: 21};
        this.testEntity = new Graph.Entity(this.testObj, this.testDatabase);
        this.testDatabase.add(this.testEntity.entity());
    });

    afterEach(function(){
        this.testObj = null;
        this.testEntity = null;
        this.testDatabase = null;
    });

    it('should initialize', function(){
        expect(this.testEntity.name).toBe('Tom');
    });


    //values
    it('should store entity attributes', function(){
        expect(this.testEntity.entity()).toEqual(this.testObj);
    });


    //methods
    it('should edit of info', function(){
        this.testEntity.edit({name: 'Tommy'});
        expect(this.testEntity.entity()).not.toEqual(this.testObj);
        this.testObj.name = 'Tommy';
        expect(this.testEntity.entity()).toEqual(this.testObj);
    });

    it('should save info', function(){
         this.testEntity.edit({name: 'Tommy'}).save(); 
         expect(this.testDatabase.query().filter({cid: 1}).first().name).toBe('Tommy');
    });

    it('should delete an entity', function(){
        //add a second entity to ensure the delete method only deletes the current entity
        this.testDatabase.add({cid: 2, name: 'Bob'});
         this.testEntity.delete(); 
        
        //only entity should be 'Bob'
         expect(this.testDatabase.query().length).toBe(1);
         expect(this.testDatabase.query().first().name).toBe('Bob');
    });

    it('should link to another entity', function(){
        var Bob = new Graph.Entity({cid: 2, name: 'Bob'}, this.testDatabase);
        this.testEntity.link({
            entity: Bob,
            rel: 'friend',
            type: 'in'
        });
        expect(this.testEntity.edges().length).toBe(1);
                
        var Sam = new Graph.Entity({cid: 3, name: 'Sam'}, this.testDatabase);
        this.testEntity.link({
            entity: Sam,
            rel: 'friend',
            type: 'in'
        });
        expect(this.testEntity.edges().length).toBe(2);
    });

    it('should return an entity\'s graph', function(){        
        var Bob = new Graph.Entity({cid: 2, name: 'Bob'}, this.testDatabase);
        this.testEntity.link({
            entity: Bob,
            rel: 'friend',
            type: 'in'
        });        
        var Sam = new Graph.Entity({cid: 3, name: 'Sam'}, this.testDatabase);
        Bob.link({
            entity: Sam,
            rel: 'friend',
            type: 'in'
        });
        
        //BFS
        expect(this.testEntity.graph({method: 'BFS'})).toEqual([{
            name: 'Bob', 
            rel: 'friend', 
            type: 'in',
            cid: 2,
            edges: [{
                name: 'Sam', 
                rel: 'friend', 
                type: 'in',
                cid: 3,
                edges: []
            }]
        }]);
    });


    //events
    it('should handle "change" events', function(){
        var result;
        this.testEntity.on('change', function(event, changes){
            result = changes;
        });
        
        this.testEntity.edit({name: 'Tommy'});
        
        expect(result).toEqual([{property: 'name', oldValue: 'Tom', newValue: 'Tommy'}]);
    });    

    it('should handle "addedge" events', function(){
        var Bob = new Graph.Entity({cid: 2, name: 'Bob'}, this.testDatabase),
            result;
        
        this.testEntity.on('addedge', function(event, data){
            result = data;
        });
        
        this.testEntity.link({
            entity: Bob,
            rel: 'friend',
            type: 'in'
        });
        
        expect(result.entity).toEqual(this.testEntity);
        expect(result.edge.entity).toEqual(Bob);
    });
});