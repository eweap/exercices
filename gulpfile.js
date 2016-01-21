// Load packages
var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var connect      = require('gulp-connect');
var minifyCss    = require('gulp-minify-css');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var gutil        = require('gulp-util');

// Shortcuts for paths and sets of files
var app = {};
app.paths = {
    main: '.',

    js:         './js',
    scss:       './scss',
    css:        './css',
    sourcemaps: '../maps',

    bowerLibs: 'bower_components',
};
app.files = {
    all:   [app.paths.main + '/**/*'],
    index: [app.paths.main + '/index.html'],

    js:   [app.paths.js + '/**/*.js'    ],
    scss: [app.paths.scss + '/**/*.scss'],
    css:  [app.paths.css + '/**/*.css'  ],
};

// General tasks
gulp.task('default', ['serve', 'watch']);

//----------------------------
// SERVER AND LIVERELOAD TASKS
//----------------------------

// Create a webserver
gulp.task('serve', [], function() {
    console.log(gutil.colors.white.bgCyan.bold('Exercises webserver launched !'));

    var serverOptions =  {
        root: app.paths.main,
        host: 'exercises.dev',
        port: 8080,
        livereload: true,
    };

    connect.server(serverOptions);
});

// Watch the development files and waiting for change
gulp.task('watch', function() {
    // SCSS
    gulp.watch(app.files.scss, ['sass']);
});

//----------------------------
// ASSETS GENERATION TASKS
//----------------------------

// Compile SCSS
gulp.task('sass', [], function() {
    return gulp.src(app.files.scss)
        .pipe(sourcemaps.init())
            .pipe(sass({
                outputStyle:  'expanded', // We don't compress CSS here, see below
                precision:    10,
                includePaths: [
                    'bower_components/foundation-sites/scss',
                    'node_modules/foundation-sites/scss',
                    'bower_components/bootstrap-sass/assets/stylesheets',
                ],
                relative:     false,
            }))
            .on('error', swallowError)
            // Add vendor prefix
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 10', 'and_chr >= 2.3'],
                cascade:  false,
                remove:   true
            }))
            // Minify the CSS
            .pipe(minifyCss({
                keepSpecialComments: 0,
                rebase:              false
            }))
            .pipe(sourcemaps.write(app.paths.sourcemaps))
        .pipe(gulp.dest(app.paths.css));
});

//----------------------------
// UTILS
//----------------------------

function swallowError (error) {
    // Details of the error in the console
    gutil.log(error.toString());

    this.emit('end');
}