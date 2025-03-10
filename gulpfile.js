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
    const dirs = [`prod/js`, `prod/css`, `prod/img`, `prod/html` ];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

let lintCSS = () => {
    return gulp.src(`css/**/*.css`)
        .pipe(stylelint({
            failAfterError: false,
        }));
};

let scripts = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify()) // Minify JavaScript
        .pipe(gulp.dest(`prod/js`));
};

let styles = () => {
    return gulp.src(`styles/**/*.css`) // Match all CSS files in the styles folder
        .pipe(cleanCSS()) // Minify CSS
        .pipe(gulp.dest(`prod/css`));
};

let html = () => {
    return gulp.src(`index.html`)
        .pipe(htmlclean())
        .pipe(gulp.dest(`prod/html`));
};

let lintJS = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

let copyAssets = () => {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`prod/img`));
};

let watchFiles = () => {
    connect.server({ livereload: true });
    gulp.watch(`js/**/*.js`, gulp.series(lintJS, scripts));
    gulp.watch(`css/**/*.css`, gulp.series(lintCSS, styles));
    gulp.watch(`index.html`, gulp.series(html));
};

let buildProd = gulp.series(
    createDirs,
    html,
    scripts,
    styles,
    gulp.parallel(copyAssets)
);

exports.lint = gulp.parallel(lintJS, lintCSS);
exports.build = gulp.series(buildProd);
exports.default = gulp.series(exports.lint, watchFiles);
