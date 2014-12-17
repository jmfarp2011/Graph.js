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
