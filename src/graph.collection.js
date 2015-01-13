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
      /*self = this,*/
      _database = _parent instanceof Graph.Database ? _parent : _parent.db();
  Object.defineProperty(this, 'length', {
    get: function(){ return _data.length; }
  });
  Object.defineProperty(this, 'data', {
    get: function(){ return _data.slice(); }
  });
  
  var _index = function(obj){
    obj.cid = obj.id || obj.cid ||_database.indexGenerator(obj);
    return obj.cid;
  };
  
  var _ops = {
    'is': function(a,b){ return a === b; },
    'gt': function(a,b){ return a > b; },
    'lt': function(a,b){ return a < b; },
    'gte': function(a,b){ return a >= b; },
    'lte': function(a,b){ return a <= b; },
    'regex': function(a, b){return a.search(b) >= 0; }
  };
  
  var _exists = function(cid){
    return cid in _indexes;
  };
  
  this.add = function(obj){
    if (!_exists(obj.cid)) {
      _indexes[_index(obj)] = _data.length;
      _data.push(obj);
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
  
  var _keysFromLevels = function(node, levels){
    if (levels.length > 1){
      return _keysFromLevels(node[levels[0]], levels.slice(1));
    }else{
      return node[levels[0]];
    }
  };
  
  this.filter = function(filters, exclude){
    exclude = !!exclude;
    var keys = Object.keys(filters),
        data = _data.slice(),
        filterData = [],
        filter;
    for (var i = 0, len = keys.length; i < len; i++){
      filter = keys[i].split('__');
      if (filter.length < 2)
        filter.push('is');
      var op = filter.pop();
      filterData.push({key: filter, op: op, value: filters[keys[i]]});
    }
    len = filterData.length;
    for (i = 0; i < len; i++){
      for (var j = 0; j < data.length; j++){
        filter = filterData[i];
        if(_keysFromLevels(data[j], filter.key) && (_ops[filter.op](_keysFromLevels(data[j], filter.key), filter.value) === exclude))
            data.splice(j--,1);
      }
    }
    return new Graph.Collection(_parent, data);
  };
  
  this.sort = function(key, desc){
    var levels = key.split('__');
    function compare(first, second) {
      var ret = !desc ? 1 : -1;
      var a = _keysFromLevels(first, levels),
        b = _keysFromLevels(second, levels);
      if (a < b)
         return -1*ret;
      if (a > b)
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
