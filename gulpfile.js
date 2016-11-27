'use strict';

const gulp = require('gulp'),
      eslint = require('gulp-eslint'),
      stylelint = require('gulp-stylelint');

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
