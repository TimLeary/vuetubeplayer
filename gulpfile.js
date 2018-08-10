const gulp = require('gulp');
const sass = require('gulp-sass');

//style paths
const sassFiles = 'src/scss/**/*.scss',
    cssDest = 'static/css/';

gulp.task('styles', function(){
    gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDest));
});
