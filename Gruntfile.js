module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            src: {
                img: 'src/client/img/',
                sass: 'src/client/sass/',

                js: 'src/client/js/',
                jsVendor: '<%= dirs.src.js %>vendor/',

                tpl: 'src/client/js/templates/'
            },
            dist: {
                img: 'dist/client/img/',
                js: 'dist/client/js/',
                jsVendor: '<%= dirs.dist.js %>vendor/'
            }
        },

        files: {
            any: '**/*',
            sass: '**/*.{scss,sass}',
            img: '**/*.{png,gif,jpg,jpeg}',
            js:  '**/*.{js,json}',

            jsArr: [
                '<%= dirs.src.js + files.js %>',
                '!<%= dirs.src.jsVendor + files.any %>'
            ],

            tpl: '**/*.html',

            tmp: '**/*.tmp*',
        },

        copy: {
            index: {
                src: 'src/client/index.html',
                dest: 'dist/client/index.html'
            },
            img: {
                expand: true,
                cwd:   '<%= dirs.src.img %>',

                src:   '<%= files.img %>',
                dest:  '<%= dirs.dist.img %>'
            },
            vendor: {
                expand: true,
                cwd:   '<%= dirs.src.jsVendor %>',

                src:   '<%= files.js %>',
                dest:  '<%= dirs.dist.jsVendor %>'
            }
        },

        watch: {
            index: {
                files: '<%= copy.index.src %>',
                tasks: ['copy:index']
            },
            img: {
                files: '<%= dirs.src.img + files.img %>',
                tasks: ['copy:img']
            },
            sass: {
                files: '<%= dirs.src.sass + files.sass %>',
                tasks: ['compass']
            },
            'js-templates': {
                files: [
                    '<%= files.jsArr %>', 
                    '<%= dirs.src.tpl + files.tpl %>',
                    '!<%= files.tmp %>'
                ],
                tasks: [
                    'jshint', 
                    'hogan', 
                    'concat', 
                    'clean:templates'
                ]
            },
            rsync: {
                files: ['dist/**/*'],
                tasks: ['exec:rsync']
            },

            'sass-push': {
                files: [
                    '<%= dirs.src.sass + files.sass %>',
                    '<%= dirs.src.img + files.img %>',
                    '<%= copy.index.src %>'
                ],
                tasks: [
                    'copy:index',
                    'copy:img',
                    'compass',
                    'exec:rsync-sass'
                ]
            }
            /*
            templates: {
                files: '<% dirs.src.tpl + files.tpl %>',
                tasks: ['hogan', 'clean:templates']
            }*/
            /*server: {}, See nodemon */
        },

        jshint: {
            files: [
                '<%= files.jsArr %>'
            ],
            options: {
                sub:true,
                globals: {
                    jQuery: true,
                    $: true,
                    Backbone: true
                }
            }
        },
        uglify: {
            files: {
                src: '<%= concat.dist.dest %>',
                dest: '<%= concat.dist.dest %>'
            },
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy hh:mm") %> */\n',
                toplevel: false
            }
        },

        clean: {
            src: ['dist'],
            development: [
                '<%= files.tmp %>'
            ],
            templates: [
                '<%= files.tmp %>'
            ]
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    '<%= dirs.src.js %>setup.js',
                    '<%= dirs.src.js %>lib/**/*.js',
                    '<%= dirs.src.js %>mixins/**/*.js',
                    '<%= dirs.src.js %>*.tmp.js',
                    '<%= dirs.src.js %>models/**/*.js',
                    '<%= dirs.src.js %>collections/**/*.js',
                    '<%= dirs.src.js %>views/**/*.js',
                    '<%= dirs.src.js %>router.js'
                ],
                dest: 'dist/client/js/main.min.js'
            }
        },

        hogan: {
            files: {
                dest: '<%= dirs.src.js %>templates.tmp.js',
                src: ['<%= dirs.src.tpl + files.tpl %>']
            },
            options: {
                defaultName: function(file) {
                    return file.split('/').pop().split('.')[0];
                }
            }
        },

        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },

        exec: {
            rsync: {
                command: 'rsync -vr dist/client/js/ emil@212.71.237.149:/srv/directdemocracy/directdemocracy/static_dev/js/'
            },
            'rsync-sass': {
                command: 'rsync --exclude=dist/client/js/ -vr dist/client/ emil@212.71.237.149:/srv/directdemocracy/directdemocracy/static_dev/'
            }
        }
    });



    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-hogan');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');


    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', [
        'clean', 
        'copy',
        'compass',
        'jshint', 
        'hogan', 
        'concat',
        'uglify', 
        'clean:templates'
    ]);

    grunt.registerTask('sass-push', [
        'clean:development',
        'watch:sass-push'
    ]);

    grunt.registerTask('development', [
        'clean:development',
        'watch'
    ]);

    grunt.registerTask('push', ['build', 'exec'])

    grunt.registerTask('debug', function(){
        grunt.log.writeflags(grunt.config.get('hogan'));
    });
};