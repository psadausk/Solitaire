var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');


var paths = {
    assets: "src/assets/*",
    server: "src/server/*.ts",
    scripts: "src/scripts/*.ts",
    html: 'index.html',
    bin: "bin/"    
};

var tsServer = plugins.typescript.createProject({
  declarationFiles: true,
  //noExternalResolve: true,
  //sortOutput: true,
  sourceRoot: paths.server,
});

var tsScripts = plugins.typescript.createProject({
  declaration: true,
  //noExternalResolve: true,
  //sortOutput: true,
  sourceRoot: paths.scripts
});

gulp.task('clean', function(cb){
    return del([paths.bin], cb)
})

//Front end stuff
gulp.task('compile-frontend', function(){
    return gulp.src(paths.scripts)
    .pipe(plugins.typescript(tsScripts)).js
    .pipe(plugins.concat('game.js'))
    .pipe(gulp.dest(paths.bin));
});

gulp.task('build-frontend', ['compile-frontend']);

// gulp.task('html', function(){
//    return  gulp.src(paths.html).pipe(gulp.dest(paths.bin));
// });

//Backend stuff
gulp.task('compile-backend', function(){
    return gulp.src(paths.server)
    .pipe(plugins.typescript(tsServer)).js
    .pipe(plugins.concat('server.js'))
    .pipe(gulp.dest(paths.bin));
});

gulp.task('build-backend', ['compile-backend']);


gulp.task('build', ['build-frontend', 'build-backend']);

gulp.task('reload', ['build'], function(){
   gulp.src(paths.index)
   .pipe(plugins.connect.reload);
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['build-frontend'/*, 'reload'*/]);
  //gulp.watch(paths.server, ['build-backend', 'reload']);
  gulp.watch(paths.index, ['reload']);
});

// gulp.task('connect', function () {
//   plugins.connect.server({
//     root: [__dirname + '/src' , paths.build],
//     port: 9000,
//     livereload: true
//   });
// });

gulp.task('connect', function () {
  plugins.nodemon({
    script: 'bin/server.js'
  });
});

 gulp.task('open', function () {
     var options = {
         //url: 'http://localhost:5858',
         app: 'chrome'
     }
     //gulp.src(paths.index)
     //gulp.src(paths.html)
     //.pipe(plugins.open(options));
 });

gulp.task('default', function(){
    runSequence('clean', 'build', 'connect', 'watch', 'open');
});

