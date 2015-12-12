'use strict';

var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var minifyJs = require('gulp-minify');

var browserSync = require('browser-sync').create();


// Source files
var SRC = {
    html: 'app/html/**/*.html',
    css: 'app/styles/**/*.scss',
    js: 'app/js/**/*.js',
    fonts: 'app/fonts/**/*',
    img: 'app/img/**/*'
};

// Destination files
var DEST = {
    html: 'dist',
    css: 'dist/css',
    js: 'dist/js',
    fonts: 'dist/fonts',
    img: 'dist/img'
};

var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

gulp.task('html', function() {
    var opts = {
        conditionals: true,
        empty:true
    };

    return gulp.src(SRC.html)
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(DEST.html));
});

// Copy fonts
gulp.task('fonts', function () {
    return gulp.src(SRC.fonts)
        .pipe(gulp.dest(DEST.fonts));
});

// Copy images
gulp.task('img', function () {
    return gulp.src(SRC.img)
        .pipe(gulp.dest(DEST.img));
});

gulp.task('css', function () {
    gulp.src(SRC.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(DEST.css))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    gulp.src(SRC.js)
        .pipe(minifyJs({
            ext:{
                src:'-uncompressed.js',
                min:'.js'
            }
        }))
        .pipe(gulp.dest(DEST.js))
});

gulp.task('clean', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});

gulp.task('serve', ['css'], function() {
    browserSync.init({
        server: ['dist', 'app', 'app/html']
    });
    gulp.watch([SRC.css], ['css']);
    gulp.watch([SRC.html]).on('change', browserSync.reload);
    gulp.watch([SRC.js]).on('change', browserSync.reload);
});

// Build for production (default)
gulp.task('default', ['html', 'fonts', 'js', 'css', 'img']);