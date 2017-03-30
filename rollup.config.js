import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps';

var config = require('./config')();



export default {
  entry: config.paths.aotBuild + 'js/src/main-aot.js',
  dest: config.paths.bundle, // output a single application bundle
  sourceMap: true,
  format: 'iife',
  onwarn: function(warning) {
    // Skip certain warnings

    // should intercept ... but doesn't in some rollup versions
    if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
    // intercepts in some rollup versions
    if ( warning.indexOf("The 'this' keyword is equivalent to 'undefined'") > -1 ) { return; }

    // console.warn everything else
    console.warn( warning.message );
  },
  plugins: [
      nodeResolve({jsnext: true, module: true}),
      commonjs({
        include: 'node_modules/rxjs/**',
      }),
      uglify({
        compress:{
          drop_debugger:false
        }
      }),
      sourcemaps()
  ]
}