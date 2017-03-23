# angular-aot
Angular production build toolcain using ngc, rollup and sorcery

- index-jit.html serves the jit application using systemjs.
  
  The application is built in the build-jit directory to keep the src folder clean.

- index.html serves the optimised application (aot compiled, bundled, tree-shaked)
  
  Sorcery then rebuilds the map chain to the original ts sources (see gif below)
![](https://raw.githubusercontent.com/boulix3/angular-aot/master/demo.gif)
