const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const babel = require(`gulp-babel`);
const htmlclean = require(`gulp-htmlclean`);
const connect = require(`gulp-connect`);
const sourcemaps = require(`gulp-sourcemaps`);
const fs = require(`fs`);
const gulpIf = require(`gulp-if`);

// Ensure 'prod/js' and 'prod/css' directories exist
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

// Scripts task (JS processing for production and development)
let scripts = () => {
    return gulp.src(`src/js/**/*.js`)

        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(gulp.dest(`prod/js`));
};

// Styles task (CSS processing for production and development)
let styles = () => {
    return gulp.src(`src/css/**/*.css`)
        .pipe(gulp.dest(`prod/css`));
};

// HTML task (minify HTML for production)
let html = () => {
    return gulp.src(`index.html`)
        .pipe(gulp.dest(`prod`));
};

let lintJS = () => {
    return gulp.src(`src/js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Watch files during development
let watchFiles = () => {
    connect.server({ livereload: true });
    gulp.watch(`src/js/**/*.js`, gulp.series(lintJS, scripts));
    gulp.watch(`src/css/**/*.css`, gulp.series(lintCSS, styles));
    gulp.watch(`index.html`, gulp.series(html));
};

// Build production folder (no linting, compressing everything)
let buildProd = gulp.series(
    createDirs,
    html,            // Minify HTML
    styles,          // Minify CSS
    scripts,         // Minify JS
);

// Export tasks
exports.lint = gulp.parallel(lintJS, lintCSS);
exports.build = gulp.series(buildProd); // Run production build
exports.default = gulp.series(exports.lint, watchFiles); // Run linting and watch files in development
