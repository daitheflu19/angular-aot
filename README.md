# angular-aot
# This is my angular production build toolcain using ngc, brotli, sorcery and file compression

- index-jit.html serves the jit application using systemjs.
The application is built in the build-jit directory to keep the src folder clean.

- index.html serves the optimised application (all static files are bundled, minified and compressed)
In the dist directory, all minified files are compressed using gzip and brotli.
The web.config is for IIS. Rewrite rules tell it to serve compressed files for all the minified static files in the dist directory.
