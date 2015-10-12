'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            css: {
                src: ['src/stylesheets/*.css'],
                dest: 'build/css/styles.min.css'
            }
        },

        uglify: {
            options: {
                mangle: true
            },
            js: {
                src: ['src/js/*.js'],
                dest: 'build/js/script.min.js'
            }
        },

        copy: {
            assets: {
                files: [
                    // includes files within path 
                    {
                        expand: true,
                        cwd: 'src/assets/',
                        src: ['**'],
                        dest: 'build/assets'
                    },{
                        expand: true,
                        cwd: 'src/',
                        src: ['*.html'],
                        dest: 'build'
                    }
                ]
            }
        }

        //     watch: {
        //         gruntfile: {
        //             files: '<%= jshint.gruntfile.src %>',
        //             tasks: ['jshint:gruntfile']
        //         },
        //         lib: {
        //             files: '<%= jshint.lib.src %>',
        //             tasks: ['jshint:lib', 'nodeunit']
        //         },
        //         test: {
        //             files: '<%= jshint.test.src %>',
        //             tasks: ['jshint:test', 'nodeunit']
        //         },
        //     },

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task.
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['cssmin', 'uglify', 'copy']);

};
