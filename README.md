# angular-aot
Angular production build toolcain using ngc and rollup

This project was build by following this [cookbook from angular.io](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html), adding a rollup plugin to get the sourcemaps pointing to the original ts files and automating the build in a gulpfile.

The built app is published to [github pages](https://boulix3.github.io/angular-aot/index.html). A debugger statement is on the "toggle header" event to check that we can see the ts source in the browser's developper tools.

- index-jit.html serves the jit application using systemjs.
  
  The application is built in the build-jit directory to keep the src folder clean.

- index.html serves the optimised application (aot compiled, bundled, tree-shaked)
  
The plugin rollup-plugin-sourcemaps then rebuilds the map chain to the original ts sources (see gif below)
![](https://raw.githubusercontent.com/boulix3/angular-aot/master/demo.gif)
