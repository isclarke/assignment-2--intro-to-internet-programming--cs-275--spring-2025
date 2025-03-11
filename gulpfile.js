const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const jsonTransform = require(`gulp-json-transform`);
const babel = require(`gulp-babel`);
const connect = require(`gulp-connect`);
const htmlmin = require(`gulp-htmlmin`);
const fs = require(`fs`);

let createDirs = (done) => {
    const dirs = [`prod/js`, `prod/css`, `prod/img`, `prod/html`, `prod/data`];
    dirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

let lintCSS = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(stylelint({
            failAfterError: false,
            reporters: [{ formatter: `string`, console: true }],
        }));
};

let lintJS = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

let scripts = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(`prod/js`))
        .pipe(connect.reload());
};

let styles = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/css`))
        .pipe(connect.reload());
};

let cleanAndCopyData = () => {
    return gulp.src(`json/data.json`)
        .pipe(jsonTransform((data) => `jsonpCallback(${JSON.stringify(data)});`, 2))
        .pipe(gulp.dest(`prod/data`))
        .pipe(connect.reload());
};

let minifyHTML = () => {
    return gulp.src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(`prod/html`));
};

let copyAssets = () => {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`prod/img`));
};

let watchFiles = () => {
    connect.server({ livereload: true });
    gulp.watch(`js/**/*.js`, gulp.series(lintJS, scripts));
    gulp.watch(`styles/**/*.css`, gulp.series(lintCSS, styles));
    gulp.watch(`json/data.json`, gulp.series(cleanAndCopyData));
};

let buildProd = gulp.series(
    createDirs,
    gulp.parallel(scripts, styles, cleanAndCopyData, minifyHTML, copyAssets)
);

exports.lint = gulp.parallel(lintJS, lintCSS);
exports.build = gulp.series(buildProd);
exports.default = gulp.series(exports.lint, watchFiles);
