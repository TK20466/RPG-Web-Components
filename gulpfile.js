var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var templates = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-htmlmin');
var version = "1.1.2";

gulp.task('templates', function () {
  return gulp.src([
      'src/views/*.html'
    ])
    .pipe(minifyHTML({collapseWhitespace: true}))
    .pipe(templates('templates.js', {
      root: '/views/',
      module: 'swaor'
   }))
    .pipe(gulp.dest('tmp'));
});

gulp.task("fonts", function() {
   return gulp.src(['src/fonts/*'])
      .pipe(gulp.dest('releases/' + version + "/fonts"))
})
gulp.task("images", function() {
   return gulp.src(['src/img/*'])
      .pipe(gulp.dest('releases/' + version + "/img"))
})

gulp.task("styles", function() {
   return gulp.src(['src/styles/site.css', 'src/styles/*.css'])
      .pipe(concat('swrpgaor.min.css'))
      .pipe(uglifycss())
      .pipe(gulp.dest('releases/' + version + "/styles"))
})

gulp.task('release', gulp.series('fonts', 'images', 'styles','templates', function() {
    return gulp.src(['src/scripts/starship.js', 'src/scripts/dice.js', 'src/scripts/**/*.js', '!./src/pkg/*', 'tmp/*.js'])
		  .pipe(concat('swrpgaor.min.js', {newLine: ';'}))
        .pipe(uglify())
        .pipe(gulp.dest('releases/' + version + "/scripts"));
}));

console.log("completed");
