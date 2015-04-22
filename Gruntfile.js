module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n\n'
            },
            dist: {
                src: [ /*'src/graph.core.js', */ 'src/graph.edge.js', 'src/graph.collection.js', 'src/graph.entity.js', 'src/graph.database.js', 'src/graph.dashboard.js', 'src/graph.component.js'],
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
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
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['<%= concat.dist.dest %>']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= concat.dist.src %>',
                tasks: ['concat', 'wrap', 'jsbeautifier:beautify', 'jshint:lib', 'jasmine', 'uglify']
            },
            tests: {
                files: '<%= jasmine.test.options.specs %>',
                tasks: ['jasmine']
            }
        },
        jsbeautifier: {
            beautify: {
                src: ['Gruntfile.js', '<%= concat.dist.dest %>'],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            check: {
                src: ['Gruntfile.js', '<%= concat.dist.dest %>'],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        },
        wrap: {
            basic: {
                src: ['<%= concat.dist.dest %>'],
                dest: '',
                options: {
                    wrapper: ['//Graph Namespace\n var Graph  = { version: \'<%= pkg.version %>\'};', '']
                }
            }
        },
        jasmine: {
            test: {
                src: '<%= concat.dist.dest %>',
                options: {
                    vendor: [
                        'node_modules/jasmine-jquery/vendor/jquery/jquery.js',
                        'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
                    ],
                    specs: 'test/modules/**.spec.js',
                    summary: true
                }
            }
        },
        karma: {
            unit: {
                options: {
                    files: ['test/**/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('debug', ['concat', 'wrap', 'jsbeautifier:beautify', 'jshint']);
    grunt.registerTask('test', ['concat', 'wrap', 'jsbeautifier:beautify', 'jshint', 'jasmine']);
    grunt.registerTask('default', ['watch']);

};
