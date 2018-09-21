var gulp = require('gulp');
var concat = require('gulp-concat');
var fs = require('fs');

// 线上部署目录
var deployPublic = '../../t8t-bi-dcp/Public';
var deployPublicBundle = deployPublic + '/bundle';

var jsSrcFiles = [
  'libs/jquery-1.9.1.min.js',
  'libs/bootstrap.min.js',
  'libs/many-select.js',
  'libs/bootbox.min.js',
  'libs/moment.min.js',
  'libs/echarts-all.js',
  'app.js',
];

gulp.task('build:js', function () {
  gulp.src(jsSrcFiles)
    .pipe(concat('index.js'))
    .pipe(gulp.dest('.'));
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
    'index.js'
  ]);
  done();
});

gulp.task('clear:deploy', function (done) {
  rmFiles([
    deployPublicBundle + '/app.js',
    deployPublicBundle + '/app.js.map',
    deployPublicBundle + '/index.js'
  ]);
  rmDir(deployPublicBundle);
  done();
});

gulp.task('clear', ['clear:build', 'clear:deploy'], function () {
  rmFiles([
    'app.js',
    'app.js.map'
  ]);
});

gulp.task('deploy', ['clear:deploy'], function () {
  gulp.src(['index.js', 'app.js', 'app.js.map'])
    .pipe(gulp.dest(deployPublicBundle));
});

gulp.task('build', ['clear:build', 'build:js']);

gulp.task('default', ['build', 'deploy']);
