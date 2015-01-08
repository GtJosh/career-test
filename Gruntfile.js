/*global module:false*/
module.exports = function(grunt) {

  "use strict";

  var urls = {
    dev: "",
    staging: "http://lp-static-sites.s3-website-us-east-1.amazonaws.com/staging/careers",
    production: "http://www.lonelyplanet.com/careers"
  };

  var shell = require("shelljs"),
      rizzoPath = shell.exec("bundle show rizzo", { async: false, silent: true }).output.replace("\n", ""),
      rizzoRequirejs = rizzoPath + "/config/requirejs.yml";

  // Project configuration.
  var customConfigs = {

    shell: {
      rizzo: {
        command: [
          "wget -O src/partials/rizzo-head.html http://rizzo.lonelyplanet.com/layouts/external/head",
          "wget -O src/partials/rizzo-pre-header.html http://rizzo.lonelyplanet.com/layouts/external/pre_header",
          "wget -O src/partials/rizzo-post-header.html http://rizzo.lonelyplanet.com/layouts/external/post_header",
          "wget -O src/partials/rizzo-footer.html http://rizzo.lonelyplanet.com/layouts/external/footer",
          "bundle update rizzo"
        ].join("&&")
      }
    },

    connect: {
      server: {
        options: {
          livereload: true,
          base: "dist",
          port: 9009
        }
      }
    },

    assemble: {
      options: {
        partials: [ "src/partials/**/*.html", "src/partials/*.hbs" ],
        flatten: false,
        expand: true,
        layout: "default.hbs",
        layoutdir: "src/layouts",
        data: "src/data/*.json"
      },
      dev: {
        files: [ {
          expand: true,
          cwd: "src/pages",
          src: "**/*.hbs",
          dest: "dist/",
          ext: ".html"
        } ],
        options: {
          rooturl: urls.dev
        }
      },
      staging: {
        files: [ {
          expand: true,
          cwd: "src/pages",
          src: "**/*.hbs",
          dest: "dist/",
          ext: ".html"
        } ],
        options: {
          rooturl: urls.staging
        }
      },
      production: {
        files: [ {
          expand: true,
          cwd: "src/pages",
          src: "**/*.hbs",
          dest: "dist/",
          ext: ".html"
        } ],
        options: {
          rooturl: urls.production
        }
      }
    },

    sass: {
      dist: {
        files: {
          "tmp/css/main.css": "src/sass/app.sass",
          "tmp/css/main_ie.css": "src/sass/app_ie.sass"
        },
        options: {
          style: "expanded",
          require: [ "sass-globbing" ],
          loadPath: [
            "src/sass",
            rizzoPath + "/app/assets/stylesheets"
          ]
        }
      }
    },

    cssmin: {
      combine: {
        options: {
          banner: "/* Minified CSS */"
        },
        files: {
          "dist/css/main.min.css": "tmp/css/main.css",
          "dist/css/main_ie.min.css": "tmp/css/main_ie.css"
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      sass: {
        files: [ "src/sass/**/*.sass" ],
        tasks: [ "style" ]
      },
      assemble: {
        files: [ "src/data/*", "src/partials/*", "src/layouts/*", "src/pages/**/*" ],
        tasks: [ "files" ]
      },
      js: {
        files: [ "src/js/**/*.js", "Gruntfile.js" ],
        tasks: [ "js" ]
      },
      images: {
        files: [ "src/images/**/*" ],
        tasks: [ "images" ]
      },
      templates: {
        files: [ "src/js/templates/**/*.html" ],
        tasks: [ "copy:templates" ]
      }
    },

    jshint: {
      src: [ "Gruntfile.js", "src/js/**/*.js", "!src/js/vendor/**/*.js" ],
      options: {
        jshintrc: "./.jshintrc"
      }
    },

    jscs: {
      src: [ "Gruntfile.js", "src/js/**/*.js", "!src/js/vendor/**/*.js" ],
      options: {
        config: "./.jscs.json"
      }
    },

    clean: {
      js: "dist/js",
      css: "dist/css",
      files: ["dist/**/**/*.html", "!dist/js/templates/**/*.html"],
      images: "dist/images",
      tmpjs: "tmp/js",
      tmpstyle: [ "tmp/sass", "tmp/css" ]
    },

    copy: {
      templates: {
        expand: true,
        cwd: "src/js",
        src: [ "templates/**/*.html" ],
        dest: "dist/js/"
      },
      app: {
        expand: true,
        cwd: "src/js",
        src: [ "**/*.js" ],
        dest: "tmp/js"
      },
      vendor: {
        expand: true,
        cwd: "src/vendor",
        src: [ "**/*" ],
        dest: "tmp/js"
      },
      rizzo: {
        expand: true,
        cwd: rizzoPath + "/app/assets/javascripts",
        src: [ "**/**/*.js" ],
        dest: "tmp/js"
      },
      rizzoVendor: {
        expand: true,
        cwd: rizzoPath + "/vendor/assets/javascripts",
        src: [ "**/**/*.js" ],
        dest: "tmp/js"
      },
      rjs: {
        expand: true,
        cwd: "src/js/vendor/requirejs",
        src: [ "require.js" ],
        dest: "dist/js"
      },
      images: {
        expand: true,
        cwd: "src/images",
        src: [ "**/*" ],
        dest: "dist/images"
      }
    },

    coffee: {
      compile: {
        files: [
          {
            expand: true,
            cwd: rizzoPath + "/app/assets/javascripts/",
            src: [ "**/*.coffee", "**/**/*.coffee", "**/**/**/*.coffee" ],
            dest: "tmp/js",
            ext: ".js"
          }
        ]
      }
    },

    requirejs: {
      options: {
        baseUrl: "tmp/js",
        findNestedDependencies: true,
        removeCombined: true,
        out: "dist/js/app.min.js",
        optimize: "uglify2",
        generateSourceMaps: true,
        preserveLicenseComments: false,
        mainConfigFile: "src/js/app.js"
      },
      app: {
        options: {
          name: "app"
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [ "last 2 versions", "ie 8", "ie 9" ]
      },
      apps: {
        src: "tmp/css/main.css",
        dest: "tmp/css/main.css"
      },
    },

    yaml: {
      rizzoRequirejsPaths: {
        options: {
          disableDest: true,
          space: 2,
          middleware: function(response) {
            customConfigs.requirejs.options.paths = response["paths"];
          }
        },
        files: {
          "config.json": rizzoRequirejs
        }
      }
    }

  };
  grunt.initConfig(customConfigs);
  // These plugins provide necessary tasks.

  grunt.loadNpmTasks("assemble");
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // Default task.
  grunt.registerTask("rizzo", [ "shell:rizzo", "dev" ]);

  grunt.registerTask("dev", [ "files", "style", "js", "images" ]);
  grunt.registerTask("staging", [ "filesStaging", "style", "js", "images" ]);
  grunt.registerTask("build", [ "filesProduction", "style", "js", "images" ]);

  grunt.registerTask("default", [ "dev", "connect", "watch" ]);

  grunt.registerTask("files", [ "clean:files", "assemble:dev" ]);
  grunt.registerTask("images", [ "clean:images", "copy:images" ]);
  grunt.registerTask("filesStaging", [ "clean:files", "assemble:staging" ]);
  grunt.registerTask("filesProduction", [ "clean:files", "assemble:production" ]);
  grunt.registerTask("style", [ "sass", "autoprefixer", "cssmin", "copy:images" ]);
  grunt.registerTask("js", [ "yaml", "clean:tmpjs", "copy:app", "copy:vendor", "coffee", "copy:rizzo", "copy:rizzoVendor", "clean:js", "requirejs", "clean:tmpjs", "copy:rjs", "copy:templates" ]);
};
