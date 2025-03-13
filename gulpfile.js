const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const babel = require(`gulp-babel`);
const connect = require(`gulp-connect`);
const htmlmin = require(`gulp-htmlmin`);
const fs = require(`fs`);
const gulpIf = require(`gulp-if`);
// Convert JSON to JSONP format
const jsonToJsonp = (data, callbackName) => {
    return `${callbackName}(${JSON.stringify(data)})`;
};



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

let minifyHTML = () => {
    return gulp.src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(`prod/html`));
};

// Copy images to development
let copyImagesToDev = () => {
    return gulp.src(`img/**/*`)
        .pipe(gulp.dest(`dev/img`));
};

// Copy images to production
let copyImagesToProd = () => {
    return gulp.src(`img/**/*`)
        .pipe(gulpIf(file => file.stat && file.stat.size > 0, gulp.dest(`prod/img`)));
};

// Copy HTML to development
let copyHTMLToDev = () => {
    return gulp.src(`index.html`) // Adjust this if you have multiple HTML files
        .pipe(gulp.dest(`dev/html`));
};

// Copy data from data.json and convert to JSONP format
let copyData = (done) => {
    const callbackName = `callback`; // You can change this to whatever you want

    // Temporarily copy to a temp directory
    gulp.src(`json/data.json`)
        .pipe(gulp.dest(`temp`))
        .on(`end`, () => {
            // Read the temporary JSON file
            fs.readFile(`temp/data.json`, `utf8`, (err, data) => {
                if (err) return done(err); // Signal error if reading fails

                // Parse the JSON data
                const jsonData = JSON.parse(data);

                // Convert to JSONP format
                const jsonpData = jsonToJsonp(jsonData, callbackName);

                // Write the JSONP data to dev/data and prod/data
                fs.writeFile(`dev/data/data.json`, jsonpData, (err) => {
                    if (err) return done(err); // Signal error if writing fails
                });
                fs.writeFile(`prod/data/data.json`, jsonpData, (err) => {
                    if (err) return done(err); // Signal error if writing fails
                });

                // Signal completion
                done();
            });
        });
};

let watchFiles = () => {
    connect.server({ livereload: true });

    gulp.watch(`js/**/*.js`, gulp.series(lintJS, transpileJSForDev));
    gulp.watch(`styles/**/*.css`, gulp.series(lintCSS, compileCSSForDev));
    gulp.watch(`html/**/*.html`).on(`change`, connect.reload);
    gulp.watch(`img/**/*`, gulp.series(copyImagesToProd)).on(`change`, connect.reload); // Reload on image changes

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
    gulp.parallel(transpileJSForProd, compileCSSForProd, minifyHTML, copyImagesToProd, copyData)
);

// Build development files
let buildDev = gulp.series(
    createDirs,
    gulp.parallel(transpileJSForDev, compileCSSForDev, copyImagesToDev, copyHTMLToDev, copyData)
);

// Combined build task for both dev and prod
let build = gulp.series(buildDev, buildProd);
let dev = gulp.series(buildDev, watchFiles, serve);

// Exports
exports.lint = gulp.parallel(lintJS, lintCSS);
exports.buildProd = buildProd; // Export the production build task
exports.buildDev = buildDev; // Export the development build task
exports.build = build; // Combined build task for both dev and prod
exports.dev = dev; // Development task
exports.default = gulp.series(exports.lint, buildDev, watchFiles);
