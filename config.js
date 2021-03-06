module.exports = function () {    
    var paths={
        jitBuild:'build-jit/',
        aotBuild:'build-aot/',
        dist: 'dist/',
        src: 'src/',        
        polyfilsSrc: ['node_modules/core-js/client/shim.min.js','node_modules/zone.js/dist/zone.min.js']        
    };  
    
    paths.polyfilsDist = paths.dist + 'polyfils/';

    paths.app = paths.src + 'app/';
        
    paths.html = paths.src + '/**/*.html';
    paths.css = paths.src + '/**/*.css';
    paths.styles = paths.src + 'styles.css';

    paths.bundle = paths.dist + 'bundle.min.js';

    paths.tsconfig = paths.src + 'tsconfig.json';
    paths.ngcconfig = 'tsconfig-aot.json';
    paths.rollupconfig= 'rollup.config.js';

    return {
        paths:paths
    };
};