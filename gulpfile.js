'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const stylelint = require('stylelint');

gulp.task('test', ['eslint', 'stylelint']);

gulp.task('eslint', function () {
    return gulp.src(['**/*.js', '!node_modules/**', '!public/js/lib/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('stylelint', function () {
    return stylelint.lint({
        configFile: '.stylelintrc.js',
        files: ['public/css/*.css'],
        formatter: 'string'
    }).then(function (result) {
        if (result.errored) {
            process.stderr.write(result.output);
            process.exit(1);
        } else {
            process.stdout.write(result.output);
        }
    });
});
