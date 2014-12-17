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
