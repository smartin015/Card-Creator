"use strict";
// Base gulp
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

    // livereload = require('gulp-livereload');
// handling individual file types
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', ['watch']);

// watch for changes
gulp.task('watch', ['css'], function() {
  // livereload.listen();
  gulp.watch(['scss/**'], ['css']);
  gulp.watch(['*.html'], ['html']);

  browserSync.init({
    port: 8000,
    server: {
      baseDir: "./"
    }
});
});

gulp.task('css', function() {
  return gulp.src(['scss/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
        // .pipe(livereload());
});

gulp.task('html', function() {
  return gulp.src(['*.html'])
        .pipe(browserSync.stream());
        // .pipe(livereload());
});