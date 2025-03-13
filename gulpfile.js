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
        .pipe(gulp.dest(`dev/js`)); // Output to dev directory
};

// Compile and minify CSS for development
let compileCSSForDev = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`dev/css`)); // Output to dev directory
};

// Transpile, minify JS for production
let transpileJSForProd = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(`prod/js`)); // Output to prod directory
};

// Compile and minify CSS for production
let compileCSSForProd = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/css`)); // Output to prod directory
};

// Clean and copy data.json to prod file
let cleanAndCopyData = () => {
    return gulp.src(`json/data.json`)
        .pipe(jsonTransform((data) => `jsonpCallback(${JSON.stringify(data)});`, 2))
        .pipe(gulp.dest(`prod/data`)); // Output to prod directory
};

// Minify HTML and move to prod file
let minifyHTML = () => {
    return gulp.src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(`prod/html`)); // Output to prod directory
};

// Copy images to development and production folders
let copyImagesToDev = () => {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`dev/img`)); // Output to dev directory
};

let copyImagesToProd = () => {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`prod/img`)); // Output to prod directory
};

// Watch files for changes
let watchFiles = () => {
    connect.server({ livereload: true });

    gulp.watch(`js/**/*.js`, gulp.series(lintJS, transpileJSForDev));
    gulp.watch(`styles/**/*.css`, gulp.series(lintCSS, compileCSSForDev));
    gulp.watch(`html/**/*.html`).on(`change`, connect.reload);
    gulp.watch(`img/**/*`).on(`change`, connect.reload); // Reload on image changes
};

// Serve task
let serve = () => {
    connect.server({
        root: `temp`, // Serve from the temp directory
        livereload: true,
        port: 8080 // You can change the port if needed
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

// Combined task for development
let dev = gulp.series(buildDev, watchFiles, serve);

// Exports
exports.lint = gulp.parallel(lintJS, lintCSS);
exports.buildProd = buildProd; // Export the production build task
exports.buildDev = buildDev; // Export the development build task
exports.dev = dev; // New task for development
exports.default = gulp.series(exports.lint, buildDev, watchFiles); // Default task for development
