const gulp = require(`gulp`);
const htmlmin = require(`gulp-htmlmin`);

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true, ignoreCustomFragments: [/<br>\s/gi] }))
    .pipe(gulp.dest("build"));
}

module.exports = html;
