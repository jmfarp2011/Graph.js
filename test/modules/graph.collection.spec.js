describe('Graph.js Collection object', function(){
    //init
    it('should not be null or undefined', function(){
        expect(Graph.Collection).not.toBe(null);
        expect(Graph.Collection).toBeDefined();
    });

    beforeEach(function(){
        this.testDatabase = new Graph.Database({
            datasource: {
                entities: [{
                    id: 1
                },{ 
                    id: 2
                },{ 
                    id: 3
                }],
                edges: []
            },
            indexGenerator: function(obj){
                return obj.id;
            }
        });
        this.testCollection = this.testDatabase.query();
                                                   });

        afterEach(function(){
            this.testDatabase = null;
            this.testCollection = null;
        });

        it('should initialize', function(){
            expect(this.testCollection.data).not.toBe(null);
            expect(this.testCollection.data).toBeDefined();
        });

        //values
        it('should calculate length', function(){
            expect(this.testCollection.length).toBe(3);
        });

        it('should return data as array', function(){
            expect(this.testCollection.data instanceof Array).toBe(true); 
        });

        //methods
        it('should add items', function(){
            this.testCollection.add(new Graph.Entity({id: 4}, this.testDatabase));
            expect(this.testCollection.length).toBe(4);
        });

        it('should remove item', function(){
            this.testCollection.remove('2');
            expect(this.testCollection.length).toBe(2);        
        });

        it('should filter items', function(){
            expect(this.testCollection.filter({cid: 2}).length).toBe(1);
            expect(this.testCollection.filter({non: 30}).length).toBe(0);
        });

        it('should sort items', function(){
            //asc
            this.testCollection.sort('id');
            expect(this.testCollection.first().id).toBe(1);

            //desc
            this.testCollection.sort('id', true);
            expect(this.testCollection.first().id).toBe(3);
        });

        it('should iterate items', function(){
            //first
            expect(this.testCollection.first().id).toBe(1);
            expect(this.testCollection.hasNext()).toBe(true);

            //next
            expect(this.testCollection.next().id).toBe(2);
            expect(this.testCollection.hasNext()).toBe(true);

            //last
            expect(this.testCollection.last().id).toBe(3);
            expect(this.testCollection.hasNext()).toBe(false);
        });

        //events
        //None
    });