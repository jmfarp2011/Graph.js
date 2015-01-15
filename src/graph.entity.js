/*
* Entity - Entity object that contains entity data, and handles the entity operations
*
* @Params:
*   entity: the raw entity object
*/
Graph['Entity'] = function(entity, database){
  if (!(database instanceof Graph.Database)) 
    throw new Error('Must supply valid instance of Graph.Database');
  var _listeners = {};
  
  for (var k in entity){
    if (entity.hasOwnProperty(k) && typeof entity[k] !== 'function'){
      this[k] = entity[k];
    }
  }
  
  this.db = function(){ return database; };
  
  this.on = function(event, callback){
      _listeners[event] = callback;
  };
  
  this.off = function(event){
    delete _listeners[event];
  };
  
  var _edges = new Graph.Collection(this);
  
  this.entity = function(){
    var obj = {};
    for (var k in this){
      if (this.hasOwnProperty(k) && typeof this[k] !== 'function')
        obj[k] = this[k];
    }
    return obj;
  };
  
  this.edit = function(obj){
    var changes = [];
    for (var k in obj){
      if (obj.hasOwnProperty(k)){
        changes.push({property: k, newValue: obj[k], oldValue: this[k]});
        this[k] = obj[k];
      }
    }
    if (!!_listeners['change'])
        _listeners['change'].call(this, 'change', changes);
    return this;
  };
  
  this.save = function(){
    database.update(this.cid, this.entity());
  };
  
  this.delete = function(){
    database.remove(this.cid);
  };
  
  this.edges = function(){
    return _edges;
  };
  
  this.link = function(edge){
    var gEdge = new Graph.Edge(edge);
    _edges.add(gEdge);
    if (!!_listeners['addedge'])
        _listeners['addedge'].call(this, 'addedge', {entity: this, edge: gEdge});
  };
  
  var _dfs = function (self, read){
    read = read || [];
    read.push(self.cid);
    //var currentEdges = this.edges();
    var edges = [],
      count = 0;
    for (var i = 0, len = _edges.length; i < len; i++){
      var edge = i === 0 ? _edges.first() : _edges.next();
      if (read.indexOf(edge.entity.cid) < 0){
        edges.push({
          name: edge.entity.name,
          rel: edge.rel,
          type: edge.type,
          cid: edge.entity.cid,
          edges: []
        });
        edges[count].edges = edge.entity.graph({method: 'DFS', read: read});
        count++;
      }
    }
    return edges;
  };
  
  var _bfs = function(self){
    var edges = [],
      queue = [{entity: self, edges: edges}], //queue self
      visited = [];
    
    function isQueued(entity){
      for (var e = 0, l = queue.length; e < l; e++){
        if (queue[e].entity === entity) return true;
      }
      return false;
    }
    
    //until the queue is empty
    while(queue.length > 0){
      var visiting = queue.shift(); //visit queue in order pushed
      visited.push(visiting.entity); //mark visiting visited
      
      //queue visiting edges, if not already queued or visited
      for (var i = 0, len = visiting.entity.edges().length; i < len; i++){
        var vedge = i === 0 ? visiting.entity.edges().first() : visiting.entity.edges().next();
        var vedges = [];
        if (!isQueued(vedge.entity) && visited.indexOf(vedge.entity) === -1){
          visiting.edges.push({
            name: vedge.entity.name,
            rel: vedge.rel,
            type: vedge.type,
            cid: vedge.entity.cid,
            edges: vedges
          });
          queue.push({
            entity: vedge.entity,
            edges: vedges
          });
        }
      }
    }
    return edges;
  };
  
  this.graph = function(options){
    var method = options.method,
      read = options.read;
    switch(method){
      case 'DFS':
        return _dfs(this, read);
      case 'BFS':
        return _bfs(this);
      default:
        throw new Error('Graph method ' + method + ' not supported.');
    }
  };
  
};
