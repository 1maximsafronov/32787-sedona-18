const gulp = require(`gulp`);

const copyImages = () => {
  return gulp
    .src(`source/img/**/*.{png,jpg,svg}`)
    .pipe(gulp.dest(`build/img`));
};

module.exports = copyImages;
