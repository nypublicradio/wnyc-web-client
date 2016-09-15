module.exports = function(grunt) {
  
  grunt.initConfig({

    modernizr: {
      dist: {
        dest: 'vendor/modernizr/modernizr-build.js',
        uglify: false,
        files: {
          src: [
            "app/**/*.{js,css,scss}"
          ]
        }
      }
    }
    
  });
  
  grunt.loadNpmTasks("grunt-modernizr");
}
