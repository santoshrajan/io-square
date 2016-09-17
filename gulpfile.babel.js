import gulp from 'gulp'
import babel from 'gulp-babel'
import del from 'del'

gulp.task('compile-lib', () =>
  gulp.src('src/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('lib')))

gulp.task('clean', () => del(['lib']))

gulp.task('default', ['compile-lib'])
