var friendslist = Graph.Component.extend({
    name: 'friendslist',
    render: function(obj){
        var $output = $('<div class="graph_component graph_component_friendslist" id="graph_component_friendslist"><strong>Friendslist</strong></div>');
        var $ul = $('<ul />').appendTo($output);
        var friends = obj.edges().filter({rel: 'knows'});
        for (var i = 0, len = friends.length; i < len; i++){
            var friend = i === 0 ? friends.first().entity : friends.next().entity;
            $ul.append($('<li>' + friend.name + '</li>'));
        }
        return $output;
    },
    events: {onaddedge: function(data){
        $('#graph_component_friendslist>ul').append($('<li>' + data.edge.entity.name + '</li>'));
    }}
});