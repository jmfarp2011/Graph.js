/*
* Database - GraphDatabase object to handles client-server communication, CRUD operations on the datasource, and local caching via localStorage
*
* @Params:
*   cacheName: the localStorage key name
*   datasource (optional): a initial datasource
*   indexGenerator: a function or key name to use to generate indexes
*/
Graph['Database'] = function(options){
    var _datasource = options && options['datasource'] ? options.datasource : {entities:[], edges:[]};
    //var _cacheName = options && options['cacheName'] ? options.cacheName : 'graphDB';
    // allows for custom index generation
    var _index = options && options.index ? options.index : 'id';
    this.index = function(obj){
        if (typeof _index === 'function'){
            obj.cid = _index(obj);
            return obj.cid;
        }
        else if (typeof _index === 'string'){
            obj.cid = obj[_index];
            if (!!obj.cid)
                return obj.cid;
        }
        throw new Error('Unable to index the supplied Object.');

    };
    var _entities = new Graph.Collection(this);

    /*
  * CRUD methods
  */  
    this.add = function(obj, overwrite){
        return _entities.add(new Graph.Entity(obj, this), overwrite);
    };

    this.query = function(filters){
        return !!filters ? _entities.spawn().filter(filters) : _entities.spawn();
    };

    this.update = function(cid, obj){
        var e = _entities.filter({cid: cid}).first();
        e.edit(obj);        
    };

    this.remove = function(cid){
        _entities.remove(cid);
    };

    /*
  *  link two entities
  */
    this.link = function(s, t, rel){
        var source = s instanceof Graph.Entity ? s : _entities.filter({cid: s}).first();
        var target = t instanceof Graph.Entity ? t : _entities.filter({cid: t}).first();
        if (!!source && !!target){
            source.link({entity: target, rel: rel, type: 'out'});
            target.link({entity: source, rel: rel, type: 'in'});
        }else{
            throw new Error('Unable to locate entity ' + !source ? s : t + ' in database.');
        }
    };

    this.ingest = function(datasource){
        /*
    * Parse datasource entities
    */
        for (var i = 0; i < datasource.entities.length; i++){
            _entities.add(new Graph.Entity(datasource.entities[i], this));
        }

        /*
    *  Parse datasource edges
    */
        for (i = 0; i < datasource.edges.length; i++){
            this.link(datasource.edges[i].source, datasource.edges[i].target, datasource.edges[i].rel);
        } 
    };
    
    this.ingestGraph = function(graph){
        var self = this;
        //get entity
        function getEntity(g){
            var e = {};
            for (var i in g){
                if (g.hasOwnProperty(i) && i !== 'edges'){
                    e[i] = g[i];
                }
            }
            
            return self.add(e, true);
        }
                
        //get edges
        function getEdges(entity, edges){
            for (var e in edges){
                var edge = edges[e],
                    other = getEntity(edge);
                if (edge.edge.type === 'out')
                    self.link(entity, other, edge.edge.rel);
                else
                    self.link(other, entity, edge.edge.rel);
                getEdges(other, edge.edges);
            }
        }
        
        //start it off
        getEdges(getEntity(graph), graph.edges);
    };
    
    this.ingest(_datasource);

    /*
  *  Add event listener(s)
  */
    this.on = function(event, callback, cid){
        if (!!cid)
            _entities.filter({cid: cid}).first().on(event, callback);
        else {
            for (var i = 0, len = _entities.length; i < len; i++){
                if (i === 0)
                    _entities.first().on(event, callback);
                else
                    _entities.next().on(event, callback);
            }
        }
    };

    /*
  *  Remove event listener
  */
    this.off = function(event, cid){
        if (cid)
            _entities.filter({cid: cid}).first().off(event);
        else {
            for (var i = 0, len = _entities.length; i < len; i++){
                if (i === 0)
                    _entities.first().off(event);
                else
                    _entities.next().off(event);
            }
        }
    };
};
