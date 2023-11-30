const gulp = require('gulp');
const sass= require('gul-sass')(require('sass'));
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js')
const eslint = rquire('gulp-eslint-new');
const nodemon = require('')
/*
const sassTask = (done) => {
  gulp.src('./scss/main.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('./hosted'));
  
  
  done();
}*/

const jsTask = (done) => {
  webpack(webpackConfig).pipe(gulp.dest('./hosted'));

  done();
}

const lintTask = (done) => {
  gulp.src('./server/**/*.js').pipe(eslint({fix: true})).pipe(eslint.format()).pipe(eslint.failAfterError());
}

const watch =(done) =>{
  gulp.watch('./client/**/*.js','./client/**/*.jsx', jsTask);
  nodemon({
    script: './server/app.js',
    tasks: ['lintTask'],
    watch: ['./server'],
  })
  done();
}

module.exports = {
  build: gulp.parallel(jsTask,lintTask,watch)
}