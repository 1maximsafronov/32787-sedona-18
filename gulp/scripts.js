const gulp = require(`gulp`);
const rename = require(`gulp-rename`);
const terser = require(`gulp-terser`);

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"));
}

module.exports = scripts;
