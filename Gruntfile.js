module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                src: 'client/js/*.js',
                dest: 'client/build/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: ['js/app/*.js']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
}