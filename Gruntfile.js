module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/graph.core.js', 'src/graph.edge.js', 'src/graph.collection.js', 'src/graph.entity.js', 'src/graph.database.js', 'src/graph.dashboard.js', 'src/graph.component.js'],
        dest: 'graph.js'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', 'concat');

};