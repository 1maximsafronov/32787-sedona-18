const gulp = require(`gulp`);


const copy = (done) => {
  gulp.src([
    `source/*.ico`,
    `source/img/**/*.svg`,
    `source/fonts/**/*.{woff,woff2}`,
  ], {
    base: `source`,
  })
    .pipe(gulp.dest(`build`));
  done();
}


module.exports = copy;
