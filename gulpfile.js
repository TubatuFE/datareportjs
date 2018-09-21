var gulp = require('gulp');
var concat = require('gulp-concat');

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
    .pipe(gulp.dest('.'))
    .pipe(gulp.dest(deployPublicBundle));
});

gulp.task('default', ['build:js'])
