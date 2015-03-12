Graph['Component'] = {
  name:'base',
  render: function(obj){ 
    var _$output = $('<div class="graph_component" id="graph_component_' + this.name + '"/>');
    for (var i in obj.entity()){
      if (obj.hasOwnProperty(i) && typeof obj[i] !== 'function')
          _$output.append(i+': <span class="graph_component_' + this.name + '" id="graph_component_' + this.name + '_' + i + '">' + obj[i] + ' </span><br/>');
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
    for (i in options){
      if (!obj[i]) obj[i] = options[i];
    }
    return obj;
  }
};