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

// Create production, development, and temp directories
let createDirs = (done) => {
    const dirs = [`prod/js`, `prod/css`, `prod/img`, `prod/html`, `prod/data`, `dev/js`, `dev/css`,
        `dev/img`, `dev/html`, `dev/data`, `temp`];
    dirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

// Lint JS files
let lintJS = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Lint CSS files
let lintCSS = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(stylelint({
            failAfterError: false,
        }));
};

// Transpile JS files to ES5 for development
let transpileJSForDev = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(gulp.dest(`dev/js`));
};

let compileCSSForDev = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`dev/css`));
};

let transpileJSForProd = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(`prod/js`));
};

let compileCSSForProd = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/css`));
};

let cleanAndCopyData = () => {
    return gulp.src(`json/data.json`)
        .pipe(jsonTransform((data) => `jsonpCallback(${JSON.stringify(data)});`, 2))
        .pipe(gulp.dest(`prod/data`));
};

let minifyHTML = () => {
    return gulp.src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(`prod/html`));
};

let copyImagesToDev = () => {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`dev/img`));
};

let copyImagesToProd = () => {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`prod/img`));
};

// Watch files for changes
let watchFiles = () => {
    connect.server({ livereload: true });
    gulp.watch(`js/**/*.js`, gulp.series(lintJS, transpileJSForDev));
    gulp.watch(`styles/**/*.css`, gulp.series(lintCSS, compileCSSForDev));
    gulp.watch(`html/**/*.html`).on(`change`, connect.reload);
    gulp.watch(`img/**/*`,gulp.series(copyImagesToProd)).on(`change`, connect.reload); // Reload on image changes
};

let serve = () => {
    connect.server({
        root: `temp`, // Serve from the temp
        livereload: true,
        port: 8080
    });
};

// Build production files
let buildProd = gulp.series(
    createDirs,
    gulp.parallel(transpileJSForProd, compileCSSForProd, cleanAndCopyData, minifyHTML, copyImagesToProd)
);

// Build development files
let buildDev = gulp.series(
    createDirs,
    gulp.parallel(transpileJSForDev, compileCSSForDev, copyImagesToDev)
);

let dev = gulp.series(buildDev, watchFiles, serve);

// Exports
exports.lint = gulp.parallel(lintJS, lintCSS);
exports.buildProd = buildProd; // Export the production build task
exports.buildDev = buildDev; // Export the development build task
exports.dev = dev;
exports.build = buildProd, buildProd;
exports.default = gulp.series(exports.lint, buildDev, watchFiles);
