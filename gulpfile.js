var gulp = require("gulp");
var runsequence = require('run-sequence');
var rimraf = require('rimraf');
var sorcery = require('sorcery');
var config = require('./config')();
var gzip = require('gulp-gzip');
var fs = require('fs');
var child_process = require('child_process');
var sourcemaps = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');

var paths = config.paths;

/**
 * executes process
 */
var execASync=function(command, cb){
    child_process.exec('.\\node_modules\\.bin\\'+command, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });    
}

var brotli=function(inputFilePath, cb){
    child_process.exec(`brotli --in ${inputFilePath} --out ${inputFilePath}.br`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);        
        cb(err);        
    });    
}

gulp.task('build:all',['build:aot','build:jit']);

gulp.task('build:aot', ['clean:aot'], function(cb){
    runsequence(['polyfils', 'css:dist', 'aot'], cb);
});

gulp.task('build:jit', function(cb){
    runsequence('clean:jit',['staticfiles','tsc'], cb);
});

/**
 * Compilation 'classique' des typescript en javascript.
 * Utile en DEV car la compilation est très rapide.
 */
gulp.task('tsc',(cb)=>{    
    execASync(`tsc -p ${paths.tsconfig}`, cb);
});

gulp.task('staticfiles', function (cb) {
    return gulp.src([paths.html, paths.css])
        .pipe(gulp.dest(paths.jitBuild));
});

gulp.task('clean:jit',(cb)=>{
    rimraf(paths.jitBuild, cb);
});

gulp.task('clean:aot',(cb)=>{
    var folders = `{${paths.dist},${paths.aotBuild}}`;
    // console.log(folders);
    rimraf(folders, cb);
});

gulp.task('clean:ngsummary',(cb)=>{
    rimraf('./**/*ngsummary*.*', cb);
});

gulp.task('aot', (cb)=>{
    runsequence('ngc','rollup', ['compress', 'sorcery'], cb);
});

/**
 * Build PROD : Etape 1
 * Compilation AOT à l'aide de ngc (@angular/compiler-cli)
 * Génère les fichier *.ngfactory.js
 */
gulp.task('ngc', (cb) => {
    execASync(`ngc -p ${paths.ngcconfig}`, cb);
});

/**
 * Build PROD : Etape 2
 * Crée le bundle final (build.js) à partir des fichiers compilés par ngc (fichiers *.ngfactory.js)
 */
gulp.task('rollup',(cb)=>{
    execASync(`rollup -c ${paths.rollupconfig}`, cb);
});
var dirtree = function(dir, regex, filelist) {  
  files = fs.readdirSync(dir);  
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
        filelist.concat(dirtree(dir + '/' + file,regex, filelist));
    }
    else if(file.match(regex)){
        filelist.push(dir + '/' + file);      
    }
  });
  return filelist;
};

gulp.task('dir', function(cb){
    var files = dirtree('dist',/\.js$|\.css$/i);
    console.log(files);
    cb();
})


/**
 * Build PROD : Etape 3
 * Permet de reconstituer la chaine des fichiers de mapping (le build.js.map pointe vers les ngfactory de ngc)
 * build.js.map => fichiers typescript du dossier src
 */
gulp.task('sorcery',(cb)=>{
    var chain = sorcery.loadSync(paths.bundle);
    chain.writeSync();
    cb();
});

/**
 * Build PROD : Etape 4
 * Compression des fichiers 
 */
gulp.task('compress', ['brotli','gzip']);

gulp.task('gzip', function(cb){      
    return gulp.src(paths.dist + '**/*.+(css|js)')
        .pipe(gzip())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('brotli', function(cb){
    var items = dirtree(paths.dist, /\.css$|\.js$/);
    var nbCallbacks=0
     var callbax= function(){
        nbCallbacks++;                
        if(nbCallbacks >= items.length){                    
            cb();
        }
    }
    for (var i=0; i<items.length; i++) {            
        brotli(items[i], callbax);        
    }
});


/**
 * css 
 */
gulp.task('css:dist', function(cb){
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))        
        .pipe(gulp.dest(paths.dist));
});

/**
 * Les taches polyfils:* seront déplacées dans Corporate.Angular
 * Ces fichiers doivent être récupérés depuis le CDN.
 */

gulp.task('polyfils',function(cb){
    runsequence('polyfils:clean','polyfils:copy','polyfils:compress', cb);
});

gulp.task('polyfils:clean', function(cb){
    rimraf(paths.polyfils, cb);
});

gulp.task('polyfils:compress', ['polyfils:gzip','polyfils:brotli']);

gulp.task('polyfils:gzip', function(cb){  
    return gulp.src(paths.polyfils+'*.js')
        .pipe(gzip())
        .pipe(gulp.dest(paths.polyfils));
});


gulp.task('polyfils:brotli', ['polyfils:clean:brotli'], function(cb){
    fs.readdir(paths.polyfils, function(err, items) {
        if(items){
            var nbItems = 0;
            var nbCallbacks =0;
            var cbz= function(){
                nbCallbacks++;                
                if(nbCallbacks >= nbItems){                    
                    cb();
                }
            }
            for (var i=0; i<items.length; i++) {
                if(items[i] && items[i].match(/\.js$|\.css$/)){
                    nbItems ++;
                    brotli(paths.polyfils+items[i], cbz);
                }
            }
        }
    });
});

gulp.task('polyfils:clean:brotli', function(cb){
    rimraf(paths.polyfils + '*.br', cb);    
});

gulp.task('polyfils:copy', function(cb){    
 return gulp.src(paths.polyfilsSrc)        
        .pipe(gulp.dest(paths.polyfils));
});