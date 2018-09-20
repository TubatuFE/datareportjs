var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');

var glob = require('glob');
var fs = require('fs');
var dependencies = require('./dependencies.json');
var sea_modules = require('./sea_modules.json');

var fromRoot = '../../t8t-bi-dcp/Public/Report/js/';
var libs = { dependencies: dependencies.libs, src: [], dest: '_libs' };
var atoms = { dependencies: dependencies.atoms, src: [], dest: '_atoms' };
var modules = { dependencies: dependencies.modules, src: [], dest: '_modules' };

gulp.task('check', function (done) {
    var lossDeps = [];
    var buildSrc = function (dependence) {
        if (sea_modules[dependence] === undefined) {
            lossDeps.push(dependence);
        }
        return fromRoot + sea_modules[dependence] + '.js';
    };
    libs.src = libs.dependencies.map(buildSrc);
    console.log('\n---------------------------\nlibs:\n', libs.src);

    atoms.src = atoms.dependencies.map(buildSrc);
    console.log('\n---------------------------\natoms:\n', atoms.src);

    modules.src = modules.dependencies.map(buildSrc);
    console.log('\n---------------------------\nmodules:\n', modules.src);

    console.log('\n---------------------------\n');
    console.log('lossDeps:', lossDeps);
    console.log('\nlossNum:', lossDeps.length);
    console.log('\n---------------------------\n');
    console.log('依赖总数:', modules.src.length + atoms.src.length + libs.src.length);
    console.log('\n===========================\n');

    var notFoundedFiles = [];
    var checkSrcFileExist = function (srcFile) {
        if (fs.existsSync(srcFile)) {
            console.log('%s\tok', srcFile);
        } else {
            console.log('%s\tnot founded', srcFile);
            notFoundedFiles.push(srcFile);
        }
    }
    libs.src.forEach(checkSrcFileExist);
    atoms.src.forEach(checkSrcFileExist);
    modules.src.forEach(checkSrcFileExist);

    console.log('\n---------------------------\n');
    console.log('not founded files:', notFoundedFiles);
    console.log('\nnot founded num:', notFoundedFiles.length);
    console.log('\n===========================\n');
    done();
});

gulp.task('cp', ['check'], function (done) {
    gulp.src(libs.src)
        .pipe(gulp.dest(libs.dest));

    gulp.src(atoms.src)
        .pipe(gulp.dest(atoms.dest));

    gulp.src(modules.src)
        .pipe(gulp.dest(modules.dest));

    done();
});

gulp.task('strip', function (done) {
    var files = glob.sync("@(_atoms|_modules)/*.js");
    files.forEach(function (file) {
      var fileContent = fs.readFileSync(file, { encoding: 'utf8' }).split('\n');
      fileContent.pop();
      fileContent.shift();
      fileContent = fileContent.join('\n');
      fs.writeFileSync(file, fileContent);
    })

    done();
});

// -------------------------------------------
// 打包seajs解构后的所有JS和CSS模块
// author: ken.li
// date: 2018-09-20
var rootPublic = '../../t8t-bi-dcp/Public';
var bundleDir = rootPublic + '/bundle';
var jsSrcFiles = [
  'libs/jquery-1.9.1.min.js',
  'libs/bootstrap.min.js',
  'libs/many-select.js',
  'libs/bootbox.min.js',
  'libs/moment.min.js',
  'libs/echarts-all.js',
  'app.js',
];
var cssSrcFiles = [
  'Report/css/style.min.css',
  'Report/css/singleselect.css'
];
var bulidPath = function (file) {
    return rootPublic + '/' + file;
}
gulp.task('build:js', function () {
    gulp.src(jsSrcFiles)
    .pipe(concat('index.js'))
    .pipe(gulp.dest('.'))
    .pipe(gulp.dest(bundleDir));
});

gulp.task('build:css', function () {
    var _cssSrcFiles = cssSrcFiles.map(bulidPath);

    gulp.src(_cssSrcFiles)
      .pipe(concat('index.css'))
      .pipe(cleanCSS())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest(rootPublic + '/Report/css'))
});

gulp.task('default', ['build:js'])

