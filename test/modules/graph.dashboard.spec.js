jasmine.getFixtures().fixturesPath = 'test/fixtures';

describe('Graph.js Dashboard object', function(){
    //init
    it('should not be null or undefined', function(){
        expect(Graph.Dashboard).not.toBe(null);
        expect(Graph.Dashboard).toBeDefined();
    });
    
    beforeEach(function(){
        var c = $('<div id="container" />').appendTo($('body'));
        this.testDashboard = new Graph.Dashboard({container: c});
    });

    afterEach(function(){
        this.testDashboard = null;
        c = null;
    });
    
    it('should intialize', function(){
        expect(this.testDashboard instanceof Graph.Dashboard).toBe(true);
        expect($('#container').length).toBeGreaterThan(0);
        expect($('#container')[0]).toBeInDOM();
    });
    
    it('should bind to a entity', function(){
        
    });
    
    it('should add a layout', function(){
        
    });
});