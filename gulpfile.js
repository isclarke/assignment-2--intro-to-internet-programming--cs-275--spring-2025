const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const babel = require(`gulp-babel`);
const htmlclean = require(`gulp-htmlclean`);
const connect = require(`gulp-connect`);
const fs = require(`fs`);


let createDirs = (done) => {
    const dirs = [`prod/js`, `prod/css`, `prod/img`, `prod/assets`];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

// Linting CSS files
let lintCSS = () => {
    return gulp.src(`src/css/**/*.css`)
        .pipe(stylelint({
            failAfterError: false,
        }));
};

let scripts = () => {
    return gulp.src(`src/js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify()) // Minify JavaScript
        .pipe(gulp.dest(`prod/js`));
};

let styles = () => {
    return gulp.src(`src/css/**/*.css`)
        .pipe(cleanCSS()) // Minify CSS
        .pipe(gulp.dest(`prod/css`));
};

let html = () => {
    return gulp.src(`index.html`)
        .pipe(htmlclean()) // Clean HTML
        .pipe(gulp.dest(`prod`));
};

let lintJS = () => {
    return gulp.src(`src/js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

let copyAssets = () => {
    return gulp.src(`src/img/**/*`) // Adjust the path as necessary
        .pipe(gulp.dest(`prod/img`));
};

let copyData = () => {
    return gulp.src(`src/data.json`) // Adjust the path as necessary
        .pipe(gulp.dest(`prod`));
};

let watchFiles = () => {
    connect.server({ livereload: true });
    gulp.watch(`src/js/**/*.js`, gulp.series(lintJS, scripts));
    gulp.watch(`src/css/**/*.css`, gulp.series(lintCSS, styles));
    gulp.watch(`index.html`, gulp.series(html));
};

let buildProd = gulp.series(
    createDirs,
    html,
    styles,
    scripts,
    gulp.parallel(copyAssets, copyData)
);

exports.lint = gulp.parallel(lintJS, lintCSS);
exports.build = gulp.series(buildProd);
exports.default = gulp.series(exports.lint, watchFiles);
