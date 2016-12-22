'use strict';

const gulp = require('gulp'),
      clean = require('gulp-clean'),
      connect = require('gulp-connect'),
      eslint = require('gulp-eslint'),
      mocha = require('gulp-mocha'),
      stylelint = require('gulp-stylelint'),
      wdio = require('gulp-wdio'),
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

gulp.task('web-test', function () { 
    var wdioResult;
    connect.server({
        name: 'Timeasr Dev Server',
        port: 8080,
        root: 'dist'
    });
    wdioResult = gulp.src('./configs/wdio.conf.js').pipe(wdio({
        type: 'selenium',
        wdio: {}
    }));
    return wdioResult.once('end', function () {
        connect.serverClose();
    }); 
}); 

gulp.task('webpack',['cleandist'] , function () {
  return gulp.src(['./src/webpackentry.js'])
    .pipe(webpack(require('./configs/webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('cleandist', function () {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});

gulp.task('precommit', ['test']);
