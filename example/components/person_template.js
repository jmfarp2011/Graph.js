var person_template = Graph.Component.extend({
  name: 'dude_gen',
  render: function(obj){
    var _$output = $('<div class="graph_component" id="graph_component_dude_gen"/>');
    for (var i in obj.entity()){
      switch(i){
        case 'image':
            _$output.prepend('<img src="' + obj[i] + '" class="mugshot"/>');
            break;
        default:
            _$output.append(i+': <span class="graph_component_' + this.name + '" id="graph_component_' + this.name + '_' + i + '">' + obj[i] + ' </span><br/>');
      }
    }
    return _$output; 
  },
  update: function(changes){
    for (var i = 0, len = changes.length; i < len; i++)
      $('span#graph_component_dude_gen_' + changes[i].property).text(changes[i].newValue);
  }
});
