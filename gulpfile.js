"use strict";

// TODO: maybe ditch gulp and only use webpack?
// see: https://webpack.js.org/guides/development/#using-watch-mode

const gulp = require("gulp");
const gulpif = require("gulp-if");
const sass = require("gulp-sass");
const argv = require("yargs").argv;
const log = require("fancy-log");
const browserSync = require("browser-sync").create();
// const concat = require("gulp-concat");
// const minify = require("gulp-uglify-es").default;
// const sourcemaps = require("gulp-sourcemaps");
const webpack = require("webpack");

const appFolder = "./app";
const srcFolder = appFolder + "/src";
const distFolder = appFolder + "/dist";
const jsFiles = distFolder + "/*.js";
const tsFiles = srcFolder + "/*.ts";
// const jsMinFolder = appFolder + "/js/min";
// const jsMinName = "app.js";
const scssFiles = srcFolder + "/scss/**/*.scss";
const cssFolder = distFolder + "/css";
const htmlFiles = distFolder + "/**/*.html";

const isRelease = argv.release === undefined ? false : true;

var config = {
  minify: isRelease,
  webpack: !isRelease
    ? require("./webpack.development.config.js")
    : require("./webpack.production.config.js")
};

function compile_css(cb) {
  gulp
    .src(scssFiles)
    .pipe(
      gulpif(config.minify, sass({ outputStyle: "compressed" }), sass({ outputStyle: "expanded" }))
    )
    .on("error", sass.logError)
    .pipe(gulp.dest(cssFolder))
    .pipe(browserSync.stream());

  cb();
}

function develop(cb) {
  browserSync.init({
    server: {
      baseDir: distFolder
    }
  });

  gulp.watch(scssFiles, { ignoreInitial: false }, compile_css);
  gulp.watch(htmlFiles, { ignoreInitial: false }).on("change", browserSync.reload);
  gulp.watch(tsFiles, { ignoreInitial: false }, webpack_compile_js);
  gulp.watch(jsFiles, { ignoreInitial: false }).on("change", browserSync.reload);

  cb();
}

// function compile_js(cb) {
// 	gulp
// 		.src(jsFiles)
// 		.pipe(gulpif(config.useSourceMap, sourcemaps.init()))
// 		.pipe(concat(jsMinName))
// 		.pipe(gulpif(config.minify, minify()))
// 		.on("error", function(err) {
// 			log.error(err.toString());
// 		})
// 		.pipe(gulpif(config.useSourceMap, sourcemaps.write()))
// 		.pipe(gulp.dest(jsMinFolder))
// 		.pipe(browserSync.stream());

// 	cb();
// }

// see: https://forestry.io/blog/gulp-and-webpack-best-of-both-worlds/
function webpack_compile_js(cb) {
  return new Promise((resolve, reject) => {
    // copy config and set mode
    // const cfgCopy = Object.assign({}, config.webpack);
    // cfgCopy.mode = "development";
    // run webpack

    webpack(config.webpack, (err, stats) => {
      if (err) {
        log.error(err.toString());
        return reject(err);
      }
      if (stats.hasErrors()) {
        const msg = stats.compilation.errors.join("\n");
        log.error(msg);
        return reject(new Error(msg));
      }
      resolve();
    });
  });
}

// use --release if compiling for release (e.g. $ gulp develop --release or $ gulp compile_js --release)

exports.default = gulp.series(compile_css, develop);
exports.compile_css = compile_css;
exports.compile_js = webpack_compile_js;
exports.develop = develop;
