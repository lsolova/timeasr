'use strict';

const gulp = require('gulp'),
      clean = require('gulp-clean'),
      eslint = require('gulp-eslint'),
      mocha = require('gulp-mocha'),
      stylelint = require('gulp-stylelint'),
      webdriver = require('gulp-webdriver'),
      webpack = require('webpack-stream');

gulp.task('test', ['eslint', 'stylelint', 'unit-test']);

gulp.task('eslint', function () {
    return gulp.src(['**/*.js', '!node_modules/**', '!dist/**', '!public/js/lib/**'])
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

gulp.task('unit-test', function () {
  return gulp.src('src/**/*.test.js', {read: false})
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('test-cucumber', function () { 
    return gulp.src('wdio.conf.js').pipe(webdriver()); 
}); 

gulp.task('webpack',['cleandist'] , function () {
  return gulp.src(['./src/webpackentry.js'])
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('cleandist', function () {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});

gulp.task('precommit', ['test']);
