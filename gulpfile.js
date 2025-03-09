const gulp = require('gulp');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const htmlclean = require('gulp-htmlclean');
const connect = require('gulp-connect');
const sourcemaps = require('gulp-sourcemaps');

let lintJS = () => {
    return gulp.src('src/js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

let lintCSS = () => {
    return gulp.src('src/css/**/*.css')
        .pipe(stylelint({
            reporters: [{ formatter: 'string', console: true }]
        }));
};

let scripts = () => {
    return gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('prod/js'));
};

let styles = () => {
    return gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('prod/css'));
};

let html = () => {
    return gulp.src('index.html')
        .pipe(htmlclean())  // Replace gulp-htmlmin with gulp-htmlclean
        .pipe(gulp.dest('prod'));
};

let watchFiles = () => {
    connect.server({ livereload: true });
    gulp.watch('src/js/**/*.js', gulp.series(lintJS, scripts));
    gulp.watch('src/css/**/*.css', gulp.series(lintCSS, styles));
    gulp.watch('index.html', gulp.series(html));
};

exports.lint = gulp.parallel(lintJS, lintCSS);
exports.build = gulp.series(html, styles, scripts);
exports.default = gulp.series(exports.lint, watchFiles);
