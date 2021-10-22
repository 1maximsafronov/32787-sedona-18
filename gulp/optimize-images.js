const gulp = require(`gulp`);
const squoosh = require("gulp-libsquoosh");

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"))
}

// const imagemin = require(`gulp-imagemin`);

// const optimizeImages = () => {
//   return gulp
//     .src(`source/img/**/*.{png,jpg,svg}`)
//     .pipe(
//       imagemin([
//         imagemin.mozjpeg({ quality: 90, progressive: true }),
//         imagemin.optipng({ optimizationLevel: 3 }),
//         imagemin.svgo(),
//       ]))
//     .pipe(gulp.dest(`build/img`));
// }

module.exports = optimizeImages;
