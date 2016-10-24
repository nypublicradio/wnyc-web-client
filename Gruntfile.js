module.exports = function(grunt) {

  grunt.initConfig({

    modernizr: {
      dist: {
        dest: 'vendor/modernizr/modernizr-build.js',
        uglify: false,
        crawl: false,
        tests: [
          "touchevents"
        ],
        options: [
          "setClasses"
        ]
      }
    }

  });

  grunt.loadNpmTasks("grunt-modernizr");
}
