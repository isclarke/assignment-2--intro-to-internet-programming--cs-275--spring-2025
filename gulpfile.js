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

// Create prod directories
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
    return gulp.src(`js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Transpile JS files to ES5 and minify
let scripts = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] })) // Transpiles to ES5
        .pipe(uglify()) // Minify
        .pipe(gulp.dest(`prod/js`))
        .pipe(connect.reload()); // Browser reload
};

// Lint CSS files
// Lint and compress CSS files
let lintCSS = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(stylelint({
            failAfterError: false,
        }));
};

// Clean and minify CSS and move to prod file
let styles = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS()) // Minify CSS
        .pipe(gulp.dest(`prod/css`))
        .pipe(connect.reload()); // Browser reload
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
    return gulp.src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(`prod/html`));
};

// Copy assets like images
let copyAssets = () => {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`prod/img`));
};

// Watch files for changes
let watchFiles = () => {
    connect.server({ livereload: true });
    gulp.watch(`js/**/*.js`, gulp.series(lintJS, scripts)); // Lint JS, then transpile/minify
    gulp.watch(`styles/**/*.css`, gulp.series(lintCSS, styles)); // Lint CSS, then minify
    gulp.watch(`json/data.json`, gulp.series(cleanAndCopyData)); // Watch data.json
};

// Build prod files
let buildProd = gulp.series(
    createDirs,
    gulp.parallel(scripts, styles, cleanAndCopyData, minifyHTML, copyAssets)
);

// Exports
exports.lint = gulp.parallel(lintJS, lintCSS); // Lint JS and CSS
exports.build = gulp.series(buildProd); // Build prod files
exports.default = gulp.series(exports.lint, watchFiles); // Start linting and watch files when `gulp` is run
