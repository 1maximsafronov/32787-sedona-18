const del = require(`del`);
const gulp = require(`gulp`);
const sass = require(`gulp-sass`);
const ghpages = require(`gh-pages`);
const csso = require(`postcss-csso`);
const rename = require(`gulp-rename`);
const terser = require(`gulp-terser`);
const plumber = require(`gulp-plumber`);
const postcss = require(`gulp-postcss`);
const htmlmin = require(`gulp-htmlmin`);
const squoosh = require("gulp-libsquoosh");
const autoprefixer = require(`autoprefixer`);
const sync = require(`browser-sync`).create();
const sourcemaps = require(`gulp-sourcemaps`);
const svgstore = require(`gulp-svgstore`);
const webp = require(`gulp-webp`);


// ============================================================================================ //
const clean = () => {
  return del(`build`);
}

module.exports.clean = clean;


// ============================================================================================ //
const copy = (done) => {
  gulp.src([
    `source/*.ico`,
    `source/fonts/**/*.{woff,woff2}`,
  ], { base: `source` })
    .pipe(gulp.dest(`build`));

  done();
}

module.exports.copy = copy;


// ============================================================================================ //
const copyImages = () => {
  return gulp.src(`source/img/**/*.{png,jpg,svg}`)
    .pipe(gulp.dest(`build/img`));
};

module.exports.copyImages = copyImages;


// ============================================================================================ //
const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"))
}

module.exports.optimizeImages = optimizeImages;


// ============================================================================================ //
const styles = () => {
  return gulp.src(`source/sass/style.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename(`style.min.css`))
    .pipe(sourcemaps.write(`.`))
    .pipe(gulp.dest(`build/css`))
    .pipe(sync.stream());
};

module.exports.styles = styles;


// ============================================================================================ //
const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true, ignoreCustomFragments: [/<br>\s/gi] }))
    .pipe(gulp.dest("build"));
}

module.exports.html = html;


// ============================================================================================ //
const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"));
}

module.exports.scripts = scripts;


// ============================================================================================ //
const svgSprite = () => {
  return gulp.src(`source/img/icon-*.svg`)
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`build/img`));
};

module.exports.svgSprite = svgSprite;


// ============================================================================================ //
const createWebp = () => {
  return gulp.src(`source/img/**/*.{png,jpg}`)
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(`build/img`));
};

module.exports.createWebp = createWebp;


// ============================================================================================ //
const loadOnGithub = () => {
  return ghpages.publish(`build`, function () { });
};


// ============================================================================================ //
const reload = (done) => {
  sync.reload();
  done();
}

// ============================================================================================ //
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    open: false,
    cors: true,
    notify: false,
    ui: false,
  });

  done();
}

// ============================================================================================ //
const watcher = () => {
  gulp.watch("source/*.html", gulp.series(html, reload));
  gulp.watch("source/sass/**/*.scss", gulp.series(styles, reload));
  gulp.watch("source/js/*.js", gulp.series(scripts, reload));
}

// ============================================================================================ //
const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svgSprite,
    createWebp
  )
);

// ============================================================================================ //
const start = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svgSprite,
    createWebp
  ),
  gulp.series(server, watcher)
);


// Экспорты тасков ============================================================================ //
module.exports.start = start;
module.exports.build = build;
module.exports.publish = gulp.series(build, loadOnGithub);
