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

// Create production folder
let createDirs = (done) => {
    const dirs = [`prod/js`, `prod/css`, `prod/img`, `prod/html`, `prod/data`];
    dirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

// Lint JS files
let lintJS = () => {
    return gulp.src(`dev/js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Transpile JS files to ES5 and compress
let transpileJSForDev = () => {
    return gulp.src(`dev/js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(`prod/js`))
        .pipe(connect.reload());
};

// Lint CSS files
let lintCSS = () => {
    return gulp.src(`dev/styles/**/*.css`)
        .pipe(stylelint({
            failAfterError: false,
        }));
};

let compileCSSForDev = () => {
    return gulp.src(`dev/styles/**/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/css`))
        .pipe(connect.reload());
};

// Clean and copy data.json to prod file
let cleanAndCopyData = () => {
    return gulp.src(`json/data.json`)
        .pipe(jsonTransform((data) => `jsonpCallback(${JSON.stringify(data)});`, 2))
        .pipe(gulp.dest(`prod/data`))
        .pipe(connect.reload()); // Browser reload
};

// Minify HTML and move to prod file
let minifyHTML = () => {
    return gulp.src(`dev/html/**/*.html`) // Changed to dev folder
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(`prod/html`));
};

// Watch files for changes
let watchFiles = () => {
    connect.server({ livereload: true });

    gulp.watch(`dev/js/**/*.js`, gulp.series(lintJS, transpileJSForDev));
    gulp.watch(`dev/styles/**/*.css`, compileCSSForDev);
    gulp.watch(`dev/html/**/*.html`, minifyHTML);
    gulp.watch(`dev/img/**/*`).on(`change`, connect.reload);

    gulp.watch(`json/data.json`, gulp.series(cleanAndCopyData));
};

// Build prod files
let buildProd = gulp.series(
    createDirs,
    gulp.parallel(transpileJSForDev, compileCSSForDev, cleanAndCopyData, minifyHTML)
);

// Exports
exports.lint = gulp.parallel(lintJS, lintCSS);
exports.build = gulp.series(buildProd);
exports.default = gulp.series(exports.lint, watchFiles);
