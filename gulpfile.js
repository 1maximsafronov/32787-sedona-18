const gulp = require(`gulp`);
const sync = require(`browser-sync`).create();
const ghpages = require(`gh-pages`);

const clean = require(`./gulp/clean`);
const copy = require(`./gulp/copy`);
const copyImages = require(`./gulp/copy-images`);
const optimizeImages = require(`./gulp/optimize-images`);
const styles = require(`./gulp/styles`);
const html = require(`./gulp/html`);
const scripts = require(`./gulp/scripts`);
const svgSprite = require(`./gulp/svg-sprite`);
const createWebp = require(`./gulp/create-webp`);

const reload = (done) => {
  sync.reload();
  done();
}

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

const watcher = () => {
  gulp.watch("source/*.html", gulp.series(html, reload));
  gulp.watch("source/sass/**/*.scss", gulp.series(styles, reload));
  gulp.watch("source/js/*.js", gulp.series(scripts, reload));
}

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
  gulp.series(
    server,
    watcher
  )
);


const loadOnGithub = () => {
  return ghpages.publish(`build`, function () { });
};

const publish = gulp.series(build, loadOnGithub);

// Экспорты тасков
module.exports.start = start;
module.exports.build = build;
module.exports.publish = publish;
