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

let scripts = () => {
    return gulp.src('main.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('prod'));
};

let styles = () => {
    return gulp.src('main.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('prod'));
};

let html = () => {
    return gulp.src('index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('prod'));
};

let watchFiles = () => {
    connect.server({ livereload: true });
    gulp.watch('main.js', gulp.series(lintJS, scripts));
    gulp.watch('main.css', gulp.series(lintCSS, styles));
};

exports.lint = gulp.parallel(lintJS, lintCSS);
exports.build = gulp.series(html, styles, scripts);
exports.default = gulp.series(exports.lint, watchFiles);
