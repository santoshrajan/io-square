import gulp from 'gulp'
import babel from 'gulp-babel'

gulp.task('compile-lib', () =>
  gulp.src('src/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('lib')))

gulp.task('default', ['compile-lib'])
