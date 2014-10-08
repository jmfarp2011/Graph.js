window.String.prototype.sha1 = window.String.prototype.sha1 || function() {
  /** Extend String object with method to encode multi-byte string to utf8
  * - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
  String.prototype.utf8Encode = String.prototype.utf8Encode || function() {
    return unescape( encodeURIComponent( this ) );
  };
  /** Extend String object with method to decode utf8 string to multi-byte */
  String.prototype.utf8Decode = String.prototype.utf8Decode || function() {
    try {
      return decodeURIComponent( escape( this ) );
    } catch (e) {
      return this; // invalid UTF-8? return as-is
    }
  };
  
  /**
  * Function 'f' [§4.1.1].
  * @private
  */
  var _f = function(s, x, y, z) {
    switch (s) {
    case 0: return (x & y) ^ (~x & z); // Ch()
    case 1: return x ^ y ^ z; // Parity()
    case 2: return (x & y) ^ (x & z) ^ (y & z); // Maj()
    case 3: return x ^ y ^ z; // Parity()
    }
  };
  /**
  * Rotates left (circular left shift) value x by n positions [§3.2.5].
  * @private
  */
  var _ROTL = function(x, n) {
    return (x<<n) | (x>>>(32-n));
  };
  /**
  * Hexadecimal representation of a number.
  * @private
  */
  var _toHexStr = function(n) {
    // note can't use toString(16) as it is implementation-dependant,
    // and in IE returns signed numbers when used on full words
    var s="", v;
    for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
    return s;
  };
  
  var msg = this.toString();
  // convert string to UTF-8, as SHA only deals with byte-streams
  msg = msg.utf8Encode();
  // constants [§4.2.1]
  var K = [ 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6 ];
  // PREPROCESSING
  msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [§5.1.1]
  // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
  var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
  var N = Math.ceil(l/16); // number of 16-integer-blocks required to hold 'l' ints
  var M = new Array(N);
  for (var i=0; i<N; i++) {
    M[i] = new Array(16);
      for (var j=0; j<16; j++) { // encode 4 chars per integer, big-endian encoding
        M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
        (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
      } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
  // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
  // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
  // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
  M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
  M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;
  // set initial hash value [§5.3.1]
  var H0 = 0x67452301;
  var H1 = 0xefcdab89;
  var H2 = 0x98badcfe;
  var H3 = 0x10325476;
  var H4 = 0xc3d2e1f0;
  // HASH COMPUTATION [§6.1.2]
  var W = new Array(80); var a, b, c, d, e;
  for (var i=0; i<N; i++) {
  // 1 - prepare message schedule 'W'
  for (var t=0; t<16; t++) W[t] = M[i][t];
  for (t=16; t<80; t++) W[t] = _ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);
  // 2 - initialise five working variables a, b, c, d, e with previous hash value
  a = H0; b = H1; c = H2; d = H3; e = H4;
  // 3 - main loop
  for (t=0; t<80; t++) {
    var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
    var T = (_ROTL(a,5) + _f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
    e = d;
    d = c;
    c = _ROTL(b, 30);
    b = a;
    a = T;
    }
    // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
    H0 = (H0+a) & 0xffffffff;
    H1 = (H1+b) & 0xffffffff;
    H2 = (H2+c) & 0xffffffff;
    H3 = (H3+d) & 0xffffffff;
    H4 = (H4+e) & 0xffffffff;
  }
  return _toHexStr(H0) + _toHexStr(H1) + _toHexStr(H2) +
  _toHexStr(H3) + _toHexStr(H4);
};

//-------------------------------------------------------------------------------------------------------------------------------//

function Graph(){}



/*
* Edge - Edge object that contains relationship data
*
* @Params:
*   edge: the raw entity object
*/
Graph['Edge'] = function(edge){
  this.entity = edge.entity;
  this.rel = edge.rel;
  this.type = edge.type;
};



/*
* Collection - Collection object that handles the collection operations
*
* @Params:
*   parent: the parent Database or Collection object
*   items: a initial datasource
*/
Graph['Collection'] = function(_parent, items){
  var _indexes = {},
      _data = [],
      self = this;
  Object.defineProperty(this, 'length', {
    get: function(){return _data.length}
  });
  
  var _index = function(obj){
    obj.cid = obj.cid || JSON.stringify(obj).sha1();
    return obj.cid;
  };
  
  var _ops = {
    'is': function(a,b){ return a === b },
    'gt': function(a,b){ return a > b },
    'lt': function(a,b){ return a < b },
    'gte': function(a,b){ return a >= b },
    'lte': function(a,b){ return a <= b }
  };
  
  var _exists = function(cid){
    return cid in _indexes;
  };
  
  this.add = function(obj){
    if (!_exists(obj.cid)) {
      _indexes[_index(obj)] = _data.length;
      _data.push(obj);
      this.length = _data.length;
    }
  };
  
  this.remove = function(cid){
    if (_exists(cid)){
      _data.splice(_indexes[cid],1);
      delete _indexes[cid];
      return true;
    }
    return false;
  };
  
  this.spawn = function(){
    return new Graph.Collection(_parent, _data.slice());
  };
  
  this.filter = function(filters, exclude){
    exclude = !!exclude;
    var keys = Object.keys(filters),
        data = _data.slice(),
        filterData = [];
    for (var i = 0, len = keys.length; i < len; i++){
      var filter = keys[i].split('__');
      filterData.push({key: filter[0], op: filter[1]||'is', value: filters[keys[i]]});
    }
    for (var i = 0, len = filterData.length; i < len; i++){
      for (var j = 0; j < data.length; j++){
        var filter = filterData[i];
        data[j][filter.key] && (_ops[filter.op](data[j][filter.key], filter.value) === exclude) && data.splice(j--,1);
      }
    }
    return new Graph.Collection(_parent, data);
  };
  
  this.sort = function(key, desc){
    function compare(a,b) {
      var ret = !desc ? 1 : -1;
      if (a[key] < b[key])
         return -1*ret;
      if (a[key] > b[key])
        return 1*ret;
      return 0;
    }
    _data.sort(compare);
    return this;
  };
  
  var _currentItem = -1;
  this.first = function(){
    _currentItem = -1;
    return _data[++_currentItem];
  };
  this.next = function(){
    if (!this.hasNext()) throw new Error('Read past end of Collection.');
    return _data[++_currentItem];
  };
  this.last = function(){
    _currentItem = _data.length;
    return _data[--_currentItem];
  };
  this.hasNext = function(){
    return _currentItem < _data.length - 1;
  };
  
  if (items)
    for (var i = 0, len = items.length; i < len; i++)
      this.add(items[i]);
};



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
  
  
  this.on = function(event, callback){
      _listeners[event] = callback;
  };
  
  this.off = function(event){
    delete _listeners[event];
  };
  
  var _edges = new Graph.Collection(this);
  
  this.edit = function(obj){
    var changes = [];
    for (var k in obj){
      if (obj.hasOwnProperty(k)){
        changes.push({property: k, newValue: obj[k], oldValue: this[k]});
        this[k] = obj[k];
      }
    }
    _listeners['change'] && _listeners['change'].call(this, 'change', changes);
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
  
  this.entity = function(){
    var obj = {};
    for (var k in this){
      if (this.hasOwnProperty(k) && typeof this[k] !== 'function')
        obj[k] = this[k];
    }
    return obj;
  };
  
  this.link = function(edge){
    var gEdge = new Graph.Edge(edge);
    _edges.add(gEdge);
    _listeners['addedge'] && _listeners['addedge'].call(this, 'addedge', {entity: this, edge: gEdge});
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
  
  this.db = function(){ return database; };
};



/*
* Database - GraphDatabase object to handles client-server communication, CRUD operations on the datasource, and local caching via localStorage
*
* @Params:
*   name: the localStorage key name
*   datasource (optional): a initial datasource
*/
Graph['Database'] = function(options){
  var _datasource = options && options['datasource'] ? options.datasource : {entities:[], edges:[]};
  var _cacheName = options && options['cacheName'] ? options.cacheName : 'graphDB';
  var _entities = new Graph.Collection(this);
    
  /*
  * CRUD methods
  */  
  this.add = function(obj){
    _entities.add(new Graph.Entity(obj, this));
  };
  
  this.query = function(){
    return _entities.spawn();
  };
  
  this.update = function(cid, obj){
    _entities.filter({cid: cid}).first().edit(obj);
  };
  
  this.remove = function(cid){
    _entities.remove(cid);
  };
  
  /*
  *  link two entities
  */
  this.link = function(sid, tid, rel){
    var source = _entities.filter({cid: sid}).first();
    var target = _entities.filter({cid: tid}).first();
    source.link({entity: target, rel: rel, type: 'out'});
    target.link({entity: source, rel: rel, type: 'in'});    
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
    for (var i = 0; i < datasource.edges.length; i++){
      this.link(datasource.edges[i].source, datasource.edges[i].target, datasource.edges[i].rel);
    } 
  };
  this.ingest(_datasource);
  
  /*
  *  Add event listener(s)
  */
  this.on = function(event, callback, cid){
    if (cid)
      _entities.filter({uid: cid}).first().on(event, callback);
    else {
      for (var i = 0, len = _entities.length; i < len; i++)
        i = 0 ? _entities.first().on(event, callback) : _entities.next().on(event, callback);
    }
  };
  
  /*
  *  Remove event listener
  */
  this.off = function(event, cid){
    if (cid)
      _entities.filter({uid: cid}).first().off(event);
    else {
      for (var i = 0, len = _entities.length; i < len; i++)
        i = 0 ? _entities.first().off(event) : _entities.next().off(event);
    }
  };
};





Graph['Dashboard'] = function(options){
  var self = this;
  var $container = options.container || null;
  var layouts = {};
  layouts['default'] = {};
  layouts.default['filterData'] = {};
  layouts.default['layout'] = options.layout || null;
  var db = options.database || null;
  
  $container.addClass('graph_dashboard');
  var _components = [],
      _entity = {off:function(){}},
      _events = [];
      
  var _configureLayout = function(name){
    var layout = layouts[name].layout;
    for (var i = 0, ilen = layout.rows.length; i < ilen; i++){
      var $row = $('<div class="' + layout.rows[i].class + '" />').appendTo($container);
      for (var j = 0, jlen = layout.rows[i].cols.length; j < jlen; j++){
        var $col = $('<div class="' + layout.rows[i].cols[j].class + '" id="' + layout.rows[i].cols[j].component.name + '" />').appendTo($row);
        self.register(layout.rows[i].cols[j].component);
      }
    }
  };
  
  this.addLayout = function(name, filterData, layout){
    layouts[name] = {
      filterData: filterData,
      layout: layout
    };
  }
  
  this.bind = function(obj){
    //check obj type
    if (!obj instanceof Graph.Entity) throw new TypeError('Graph.Dashboard can only be bound to objects of type Graph.Entity');
    
    for (var i = 0, len = _events.length; i < len; i++){
      _entity.off(_events[i]); //debind events from old entity
      obj.on(_events[i], this.update); //rebind events to new entity
    }
    _entity = obj; //replace old entity with new entity
    
    //clear container
    $container.html('');

    //reconfigure layout
    _components = [];
    var layout = 'default';
    for (var l in layouts){
      var match = false;
      for (var i = 0, keys = Object.keys(layouts[l].filterData), len = keys.length; i < len; i++){
        if (layouts[l].filterData[keys[i]] !== obj[keys[i]]){
          match = false;
          break;
        }
        match = true;
      }
      if (!match) continue;
      
      layout = l;
      break;
    }
    _configureLayout(layout);
    
    //(re)render components
    for (var i = 0; i < _components.length; i++){
      _components[i]['render'] && $('#' + _components[i].name).html(_components[i].render(_entity));
    }
  };
  
  this.bindFirst = function(filterData){
    this.bind(db.query().filter(filterData).first());
  }
  
  this.register = function(component){
    _components.push(component);
    for (var e in component.events){
      (_events.indexOf(e) === -1) && _events.push(e.replace(/^(on)/m, ''));
    }
    component['dashboard'] = this;
  };
  
  this.update = function(event, data){
    for (var i = 0; i < _components.length; i++){
      if (_components[i].events['on'+event])
       _components[i].events['on'+event].call(_components[i], data);
    }
  };
  
  _configureLayout('default');
};

Graph['Component'] = {
  name:'base',
  render: function(obj){ 
    var _$output = $('<div class="graph_component" id="graph_component_' + this.name + '"/>');
    for (var i in obj.entity()){
      obj.hasOwnProperty(i) && typeof obj[i] !== 'function' && _$output.append(i+': <span class="graph_component_' + this.name + '" id="graph_component_' + this.name + '_' + i + '">' + obj[i] + ' </span><br/>');
    }
    return _$output;
  },
  events: {
    onchange: function(changes){ 
      for (var i = 0, len = changes.length; i < len; i++)
        $('span#graph_component_' + this.name + '_' + changes[i].property).text(changes[i].newValue); }
  },
  extend: function(options){
    var obj = Object.create(this);
    for (var i in this){
      obj[i] = options[i] || this[i];
    }
    for (var i in options){
      if (!obj[i]) obj[i] = options[i];
    }
    return obj;
  }
};