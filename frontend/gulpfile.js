'use strict';

var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    mainBowerFiles = require('main-bower-files'),
    gulpFilter   = require('gulp-filter'),
    del = require('del'),
    order = require("gulp-order"),
    inject = require('gulp-inject'),
	sass = require('gulp-sass');

gulp.task('clean', function (callback) {
    del(['public/**/*.*'], callback);
});

gulp.task('sass', ['clean'], function () {
	gulp.src(['./app/css/*.css','./app/css/*.scss'], {base: './app/css'})
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('./public/css'));
});

gulp.task('bower', ['clean'], function() {
    var bowerOptions = {
        debugging: false,
        overrides: {
            'jquery': {
                ignore: true
            }
        }
    };

    var jsFilter = gulpFilter('*.js', {restore: true}),
        cssFilter = gulpFilter('*.css', {restore: true}),
        fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf'], {restore: true}),
        imageFilter = gulpFilter(['*.gif', '*.png', '*.svg', '*.jpg', '*.jpeg'], {restore: true});


    return gulp.src(mainBowerFiles(bowerOptions))
        // JS
        .pipe(jsFilter)
        .pipe(gulp.dest('./public/lib/js'))
        .pipe(jsFilter.restore())

        // CSS
        .pipe(cssFilter)
        .pipe(gulp.dest('./public/lib/css'))
        .pipe(cssFilter.restore())

        // FONTS
        .pipe(fontFilter)
        .pipe(gulp.dest('./public/lib/fonts'))
        .pipe(fontFilter.restore())

        // IMAGES
        .pipe(imageFilter)
        .pipe(gulp.dest('./public/lib/img'))
        .pipe(imageFilter.restore())
});


gulp.task('angular', ['clean'], function() {

    var sources = gulp.src('./app/components/**/*.*',{base: './app/components'});

    var htmlFilter = gulpFilter(['**/*.html']);

    return sources
        .pipe(htmlFilter)
        .pipe(gulp.dest('./public/partials'))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest('./public/components'));
});



gulp.task('inject', ['bower', 'sass'], function() {

    var target = gulp.src('./app/index.html');
    var sources = gulp.src([
            './public/lib/css/*.css',
            './public/lib/js/*.js',
            './public/css/*.css'
        ], {read: false})
        .pipe(order([
            "moment.js",
            "jquery.js",
            "angular.js"
        ]));

    var injectOptions = {
        name: 'lib',
        ignorePath: 'public',
        addRootSlash: false
    };

    return target
        .pipe(inject(sources,injectOptions))
        .pipe(gulp.dest('./public'));
});

gulp.task('build', ['inject', 'angular'], function() {
	gulp.src(['./app/img/*'], {base: './app/img'})
	.pipe(gulp.dest('./public/img'));
    gulp.src(['./app/js/*'], {base: './app/js'})
        .pipe(gulp.dest('./public/js'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch('./bower_components/**/*.*', ['inject']);
    gulp.watch('./app/components/**/*.*', ['build']);
    gulp.watch('./app/**/*.*', ['build']);
});


gulp.task('webserver', ['watch'], function() {
    var webserverOptions = {
        livereload: true,
        host: '127.0.0.1',
        port: '8080'
    }

    return gulp.src('./public')
        .pipe(webserver(webserverOptions));
});

gulp.task('default', ['webserver']);