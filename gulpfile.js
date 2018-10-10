var gulp = require('gulp');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var rollup = require('rollup');
var fs = require('fs');
var pkg = require('./package.json');
var version = pkg.version;

gulp.task('bundle', async function () {
  var bundle = await rollup.rollup({
    input: 'src/App.js',
    context: 'window',
  });

  await bundle.write({
    name: 'App',
    file: 'dist/app.js',
    format: 'umd', // iife: 浏览器 cjs: Node.js umd: 浏览器和 Node.js
    sourcemap: 'inline'
  });
});

// 线上部署目录
var deployPublic = '../../t8t-bi-dcp/Public';
var deployPublicBundle = deployPublic + '/bundle';

var jsLibFiles = [
  'src/libs/jquery-1.9.1.min.js',
  'src/libs/bootstrap.min.js',
  'src/libs/many-select.js',
  'src/libs/bootbox.min.js',
  'src/libs/moment.min.js',
  'src/libs/echarts-all.js'
];

var jsSrcFiles = [
  'src/libs/jquery-1.9.1.min.js',
  'src/libs/bootstrap.min.js',
  'src/libs/many-select.js',
  'src/libs/bootbox.min.js',
  'src/libs/moment.min.js',
  'src/libs/echarts-all.js',
  'dist/app.js',
];

gulp.task('build:lib', function () {
  gulp.src(jsLibFiles)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:js', function () {
  gulp.src(jsSrcFiles)
    .pipe(concat('index.js'))
    .pipe(gulp.dest('dist'));
});

var rmDir = function (dpath) {
  if (fs.existsSync(dpath)) {
    fs.rmdirSync(dpath);
  } else {
    console.log('路径%s不存在', dpath);
  }
}

var rmFile = function (fpath) {
  if (fs.existsSync(fpath)) {
    fs.unlinkSync(fpath);
  } else {
    console.log('文件%s不存在', fpath);
  }
}

var rmFiles = function (fpathArr) {
  fpathArr.forEach(function (fpath) {
    rmFile(fpath);
  });
}

gulp.task('clear:build', function (done) {
  rmFiles([
    'dist/index.js'
  ]);
  done();
});

gulp.task('clear:deploy', function (done) {
  rmFiles([
    deployPublicBundle + '/app.js',
    deployPublicBundle + '/app.js.map',
    deployPublicBundle + '/index.js',
    deployPublicBundle + '/lib.js'
  ]);
  rmDir(deployPublicBundle);
  done();
});

gulp.task('clear', ['clear:build', 'clear:deploy'], function () {
  rmFiles([
    'dist/app.js',
    'dist/app.js.map'
  ]);
});

gulp.task('deploy', ['clear:deploy'], function () {
  gulp.src(['dist/index.js', 'dist/app.js', 'dist/app.js.map', 'dist/lib.js'])
      .pipe(gulp.dest(deployPublicBundle));
});

gulp.task('build', ['clear:build', 'build:js']);

gulp.task('default', function () {
  var watcher = gulp.watch('src/**/*.js', ['bundle']);
  watcher.on('change', function(path, stats) {
    gulp.src(['dist/app.js', 'dist/app.js.map'])
        .pipe(gulp.dest(deployPublicBundle));
  });
});

gulp.task('html', function () {
  htmlreplace()
  gulp.src('src/html/ViewReport.html')
    .pipe(htmlreplace({
      'css': '/Public/Report/css/index.min.css?v=1.0.0',
      'js': [
        '/Public/bundle/lib.js?v=1.0.0',
        '/Public/bundle/app.js?v=' + version
      ]
    }))
    .pipe(gulp.dest('../../t8t-bi-dcp/Apps/Tpl/Report/Default/Business'));
})
