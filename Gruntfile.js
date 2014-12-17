module.exports = function(grunt) {

  grunt.initConfig({
     pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/graph.core.js', 'src/graph.edge.js', 'src/graph.collection.js', 'src/graph.entity.js', 'src/graph.database.js', 'src/graph.dashboard.js', 'src/graph.component.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('debug', 'concat');
  grunt.registerTask('default', ['concat', 'uglify']);

};
