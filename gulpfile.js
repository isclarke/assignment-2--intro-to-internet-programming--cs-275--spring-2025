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

// Transpile JS files to ES5
let transpileJSForDev = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(gulp.dest(`data.json/js`));
};

// Compile and minify CSS for production
let compileCSSForProd = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/css`));
};

// Transpile, minify JS for production
let transpileJSForProd = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(`prod/js`));
};

// Clean and copy data.json to prod file
let cleanAndCopyData = () => {
    return gulp.src(`json/data.json`)
        .pipe(jsonTransform((data) => `jsonpCallback(${JSON.stringify(data)});`, 2))
        .pipe(gulp.dest(`prod/data`));
};

// Minify HTML and move to prod file
let minifyHTML = () => {
    return gulp.src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(`prod/html`));
};

let copyImages = () => {
    return gulp.src(`img/**/`)
        .pipe(gulp.dest(`prod/img`));
};

// Watch files for changes
let watchFiles = () => {
    connect.server({ livereload: true });

    gulp.watch(`js/**/*.js`, gulp.series(lintJS, transpileJSForDev));
    gulp.watch(`styles/**/*.css`, gulp.series(lintCSS));
    gulp.watch(`html/**/*.html`).on(`change`, connect.reload);
    gulp.watch(`img/**/*`).on(`change`, connect.reload); // Reload on image changes
};

// Build prod files
let buildProd = gulp.series(
    createDirs,
    gulp.parallel(transpileJSForProd, compileCSSForProd, cleanAndCopyData, minifyHTML, copyImages)
);

// Exports
exports.lint = gulp.parallel(lintJS, lintCSS);
exports.build = gulp.series(buildProd);
exports.default = gulp.series(exports.lint, watchFiles);
