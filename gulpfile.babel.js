'use strict';

import path from 'path';
import gulp from 'gulp';
import babel from 'gulp-babel';
import autoprefixer from 'gulp-autoprefixer';
import header from 'gulp-header';
import gutil from 'gulp-util';
import connect from 'gulp-connect';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import glob from 'glob';
import pkg from './package.json';

const outputPaths = {
  css: './',
  js: './',
  pug: './',
};

const banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

// Build Directories
const dataWatchDir = path.join(__dirname, 'data', '**', '*.js');
const cssWatchDir = path.join(__dirname, 'css', '**', '*.scss');
const cssSourceDir = path.join(__dirname, 'css', 'stylesheet.scss');
const jsWatchDir = path.join(__dirname, 'js', '**', '*.js');
const jsSourceDir = path.join(__dirname, 'js', '**', '*.js');
const pugWatchDir = path.join(__dirname, 'pug', '**', '*.pug');
const pugSourceDir = path.join(__dirname, 'pug', '**', 'index.pug');

function onError(err) {
  console.log(err);
  this.emit('end');
}

// CSS
gulp.task('build-css', () => {
  gutil.log('\n\nBuild CSS Paths: \n', cssSourceDir, '\n\n');

  return gulp.src(cssSourceDir)
    .pipe(autoprefixer('last 2 versions', 'ie 10', 'ie 11'))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest(outputPaths.css))
    .pipe(connect.reload());
});

// JS
gulp.task('build-js', () => {
  gutil.log('\n\nBuild JS Paths: \n', jsSourceDir, '\n\n');

  return gulp.src(jsSourceDir)
    .on('error', onError)
    .pipe(babel())
    .pipe(uglify())
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest(outputPaths.js))
    .pipe(connect.reload());
});

// PUG
gulp.task('build-pug', () => {
  gutil.log('\n\nBuild pug Paths: \n', pugSourceDir, '\n\n');

  const locals = {
    title: 'Jason Park',
    description: pkg.description,
    author: pkg.author,
    data: {},
  };
  glob.sync(dataWatchDir).forEach((file) => {
    const name = path.basename(file, path.extname(file));
    delete require.cache[require.resolve(file)];
    locals.data[name] = require(file);
  });

  return gulp.src(pugSourceDir)
    .on('error', onError)
    .pipe(pug({ locals }))
    .pipe(gulp.dest(outputPaths.pug))
    .pipe(connect.reload());
});

// Build
gulp.task('build', ['build-css', 'build-js', 'build-pug']);

// Server
gulp.task('connect', function () {
  connect.server({
    port: process.env.PORT || 8080,
    livereload: true
  });
});

// Watch
gulp.task('watch', function () {
  gulp.watch(cssWatchDir, ['build-css']);
  gulp.watch(jsWatchDir, ['build-js']);
  gulp.watch(pugWatchDir, ['build-pug']);
  gulp.watch(dataWatchDir, ['build-pug']);
});

// Default
gulp.task('default', ['connect', 'watch']);