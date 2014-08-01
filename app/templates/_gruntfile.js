module.exports = function(grunt) {
    var themeName = '<%= themeName %>';
    var localHost = '<%= localHost %>';
    var skinDir = 'skin/frontend/default/' + themeName + '/';
    var appDir = 'app/';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        compass: {
            dist: {
                options: {
                    sassDir: skinDir + 'scss',
                    cssDir: skinDir + 'css',
                    generatedImagesDir: skinDir + 'images/generated',
                    imagesDir: skinDir + 'images',
                    javascriptsDir: skinDir + 'js',
                    fontsDir: skinDir + 'fonts',
                    importPath: 'bower_components',
                    httpImagesPath: '/' + skinDir + 'images',
                    httpGeneratedImagesPath: '/' +  skinDir + 'images/generated',
                    relativeAssets: true,
                    noLineComments: true,
                    //debugInfo: false,
                    //sourcemap: false,
                    //force: true,
                    environment: 'development',
                    outputStyle: 'nested'
                }
            }
        },
        watch: {
            css: {
                options: {
                    spawn: false
                },
                files: [skinDir + '**/*.{scss,sass,less}'],
                tasks: ['compass','sync']
            },
            js: {
                files: [
                    appDir + '**/*.{phtml,xml}',
                    [skinDir + 'js/*.js', '!' + skinDir + 'js/*.min.js']
                ],
                tasks: ['jshint','concat','uglify','sync']
            },
            img: {
                files: [skinDir + 'images/{,*/}*.{png,jpg,jpeg,gif,webp,ico,svg}'],
                tasks: ['sync']
            }
        },
        sync: {
            main: {
                files: [{
                    src: [
                        appDir + 'code/local/**/*.{php,xml}',
                        appDir + 'code/community/**/*.{php,xml}',
                        appDir + 'etc/modules/*.xml',
                        appDir + 'locale/**/*.{csv,html}',
                        appDir + 'design/**/*.{phtml,xml,csv}',
                        skinDir + '**/*.css',
                        skinDir + 'images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        skinDir + 'js/*.js',
                        'js/**/*.js'
                    ], 
                    dest: '../magento/'
                }]
            }
        },
        browserSync: {
            bsFiles: {
                src: [
                    '../magento/' + appDir + 'design/frontend/**/*.{php,phtml,xml}',
                    '../magento/' + skinDir + '**/*.css',
                    '../magento/' + skinDir + 'images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '../magento/' + skinDir + 'js/*.min.js'
                ]
            },
            options: {
                watchTask: true,
                proxy: localHost
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                skinDir + ['js/{,*/}*.js', '!js/{,*/}*.min.js']
            ]
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'bower_components/modernizr/modernizr.js',
                    'bower_components/html5shiv/dist/html5shiv.js',
                    'bower_components/respond/dest/respond.min.js',
                    'bower_components/selectivizr/selectivizr.js'
                ],
                dest: 'skin/frontend/default/' + themeName + '/js/vendor/plugins.js'
            }
        },
        uglify: {
            dist: {
                options: {
                    mangle: false
                },
                files: {
                    'skin/frontend/default/<%= themeName %>/js/script.min.js': [skinDir + 'js/script.js'],
                    'skin/frontend/default/<%= themeName %>/js/vendor/plugins.min.js': [skinDir + 'js/vendor/plugins.js']
                }
            }
        }
    });

    grunt.registerTask('build', [
        'compass',
        'jshint',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('server', [
        'compass',
        'jshint',
        'concat',
        'uglify',
        'browserSync',
        'watch',
        'sync'
    ]);
};