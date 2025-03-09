const gulp = require('gulp');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const connect = require('gulp-connect');
const sourcemaps = require('gulp-sourcemaps');

let lintJS = () => {
    return gulp.src('main.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

let lintCSS = () => {
    return gulp.src('main.css')
        .pipe(stylelint({
            reporters: [{ formatter: 'string', console: true }]
        }));
};
