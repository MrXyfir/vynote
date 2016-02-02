var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var gzip = require('gulp-gzip');
var gulp = require('gulp');

var isDev = require('./config').environment.development;

/*
	css
	- imports css files
	- autoprefixer
	- minifies / gzip
*/
gulp.task('css', function () {
    return gulp.src('./styles/style.css')
		.pipe(require('gulp-postcss')([
            require('autoprefixer')(
                {browsers: 'last 1 version, > 10%'}
            ),
            require('cssnano')
        ]))
		.pipe(!isDev ? gzip() : gutil.noop())
		.pipe(gulp.dest('./public/css'));
});

/*
	client
    - convert es2015 -> es5
    - converts JSX -> plain JS
	- bundles React componenents
	- minifies / gzip
*/
gulp.task('client', function () {
    var babelify = require("babelify");
    var uglify = require('gulp-uglify');

    return require("browserify")(
        './client/containers/App.jsx',
        { extensions: '.jsx' }
    )
    .transform(babelify, {
        presets: ["es2015", "react"],
        extensions: [".jsx"]
    })
    .bundle()
    .pipe(source('App.js'))
    .pipe(streamify(uglify({
        mangle: false,
        compress: {
            unused: false
        }
    })))
    .on('error', gutil.log)
    .pipe(!isDev ? gzip() : gutil.noop())
    .pipe(gulp.dest('./public/js/'));
});