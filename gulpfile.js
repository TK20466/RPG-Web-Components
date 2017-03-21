var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var templates = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-htmlmin');
var version = "0.9.5";

gulp.task('templates', function () {
  gulp.src([
      'src/views/*.html'
    ])
    .pipe(minifyHTML({collapseWhitespace: true}))
    .pipe(templates('templates.js', {
      root: '/views/',
      module: 'swrpgwc'
   }))
    .pipe(gulp.dest('tmp'));
});

gulp.task("fonts", function() {
   gulp.src(['src/fonts/*'])
      .pipe(gulp.dest('releases/' + version + "/fonts"))
})
gulp.task("images", function() {
   gulp.src(['src/img/*'])
      .pipe(gulp.dest('releases/' + version + "/img"))
})

gulp.task("styles", function() {
   gulp.src(['src/styles/fonts.css', 'src/styles/printer.css'])
      .pipe(concat('swrpg.min.css'))
      .pipe(uglifycss())
      .pipe(gulp.dest('releases/' + version + "/styles"));
   gulp.src(['src/styles/eoe.css'])
      .pipe(concat('swrpgeoe.min.css'))
      .pipe(uglifycss())
      .pipe(gulp.dest('releases/' + version + "/styles"));
   gulp.src(['src/styles/aor.css'])
      .pipe(concat('swrpgaor.min.css'))
      .pipe(uglifycss())
      .pipe(gulp.dest('releases/' + version + "/styles"));
   gulp.src(['src/styles/fad.css'])
      .pipe(concat('swrpgfad.min.css'))
      .pipe(uglifycss())
      .pipe(gulp.dest('releases/' + version + "/styles"));
})

gulp.task('release', ['fonts', 'images', 'styles','templates'], function() {
    return gulp.src(['src/scripts/starship.js', 'src/scripts/dice.js', 'src/scripts/jdf-ngThemeSwitcher.min.js', 'src/scripts/**/*.js', '!./src/pkg/*', 'tmp/*.js'])
		  .pipe(concat('swrpgwc.min.js', {newLine: ';'}))
        //.pipe(uglify())
        .pipe(gulp.dest('releases/' + version + "/scripts"));
});

console.log("completed");
