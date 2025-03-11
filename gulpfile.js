const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const cleanCSS = require(`gulp-clean-css`);
const uglify = require(`gulp-uglify`);
const jsonTransform = require(`gulp-json-transform`);
const babel = require(`gulp-babel`);
const connect = require(`gulp-connect`);
const fs = require(`fs`);

const createDirs = (done) => {
    const dirs = [`prod/js`, `prod/css`, `prod/img`, `prod/html`, `prod/data`];
    dirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    done();
};

const lintCSS = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(stylelint({
            failAfterError: false,
            reporters: [{ formatter: `string`, console: true }],
        }));
};

const lintJS = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

const scripts = () => {
    return gulp.src(`js/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(uglify())
        .pipe(gulp.dest(`prod/js`))
        .pipe(connect.reload());
};

const styles = () => {
    return gulp.src(`styles/**/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/css`))
        .pipe(connect.reload());
};

const cleanAndCopyData = () => {
    return gulp.src(`json/data.json`)
        .pipe(jsonTransform((data) => `jsonpCallback(${JSON.stringify(data)});`, 2))
        .pipe(gulp.dest(`prod/data`))
        .pipe(connect.reload());
};

const watchFiles = () => {
    connect.server({ livereload: true });
    gulp.watch(`js/**/*.js`, gulp.series(lintJS, scripts));
    gulp.watch(`styles/**/*.css`, gulp.series(lintCSS, styles));
    gulp.watch(`json/data.json`, gulp.series(cleanAndCopyData));
};

const buildProd = gulp.series(createDirs, scripts, styles, cleanAndCopyData);

exports.lint = gulp.parallel(lintJS, lintCSS);
exports.build = gulp.series(buildProd);
exports.default = gulp.series(exports.lint, watchFiles);
