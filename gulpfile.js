'use strict';

const gulp = require('gulp'),
      clean = require('gulp-clean'),
      eslint = require('gulp-eslint'),
      stylelint = require('gulp-stylelint'),
      webpack = require('webpack-stream');

gulp.task('test', ['eslint', 'stylelint']);

gulp.task('eslint', function () {
    return gulp.src(['**/*.js', '!node_modules/**', '!public/js/lib/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('stylelint', function () {
    return gulp.src(['public/css/*.css'])
        .pipe(stylelint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        }));
});

gulp.task('webpack',['cleandist'] , function () {
  return gulp.src(['public/js/app.js'])
    .pipe(webpack({output: {filename: 'measr.js'}}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('cleandist', function () {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});

gulp.task('precommit', ['test']);
