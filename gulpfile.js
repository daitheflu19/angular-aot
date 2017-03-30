var gulp = require("gulp");
var runsequence = require('run-sequence');
var rimraf = require('rimraf');
var config = require('./config')();
var fs = require('fs');
var child_process = require('child_process');

var paths = config.paths;


/**
 * executes a process using a bin in node_modules like ngc
 */
var execASync=function(command, cb){
    child_process.exec('.\\node_modules\\.bin\\'+command, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });    
}

gulp.task('build:all',['build:aot','build:jit']);

gulp.task('build:aot', function(cb){
    runsequence('aot:clean', ['aot:polyfils', 'aot:css', 'aot:sequence'], cb);
});

gulp.task('build:jit', function(cb){
    runsequence('jit:clean',['jit:staticfiles','jit:tsc'], cb);
});

/**
 * JIT build tasks
 */
gulp.task('jit:tsc',(cb)=>{    
    execASync(`tsc -p ${paths.tsconfig}`, cb);
});
gulp.task('jit:staticfiles', function (cb) {
    return gulp.src([paths.html, paths.css])
        .pipe(gulp.dest(paths.jitBuild));
});
gulp.task('jit:clean',(cb)=>{
    rimraf(paths.jitBuild, cb);
});

/**
 * AOT build tasks
 */
gulp.task('aot:clean',(cb)=>{
    var folders = `{${paths.dist},${paths.aotBuild}}`;
    // console.log(folders);
    rimraf(folders, cb);
});
gulp.task('aot:polyfils', function(cb){    
 return gulp.src(paths.polyfilsSrc)        
        .pipe(gulp.dest(paths.polyfilsDist));
});
gulp.task('aot:css', function(cb){    
    return gulp.src(paths.styles)
        .pipe(gulp.dest(paths.dist));
});

/**
 * Build sequence : 
 * - ngc        => AOT compilation
 * - rollup     => bundling and tree shaking 
 */
gulp.task('aot:sequence', (cb)=>{
    runsequence('aot:ngc','aot:rollup', cb);
});

gulp.task('aot:ngc', (cb) => {
    execASync(`ngc -p ${paths.ngcconfig}`, cb);
});
gulp.task('aot:rollup',(cb)=>{
    execASync(`rollup -c ${paths.rollupconfig}`, cb);
});

gulp.task('github-pages', ['clean-github-pages'],(cb)=>{    
    return gulp.src(['index.html','{dist,src}/**/*'])
        .pipe(gulp.dest('docs'));    
});

gulp.task('clean-github-pages',(cb)=>{
    rimraf('docs', cb);
});