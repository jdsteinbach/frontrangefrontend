(function() {
  'use strict';

  /**
   * Required node plugins
   */
  var gulp        = require('gulp');
  var glob        = require('glob');
  var del         = require('del');
  var browserSync = require('browser-sync').create();
  var reload      = browserSync.reload;
  var $           = require('gulp-load-plugins')();
  var postcss     = require('gulp-postcss');
  var prefix      = require('autoprefixer');
  var cssnano     = require('cssnano');


  /**
   * Set up prod/dev tasks
   */
  var is_prod       = !($.util.env.dev);


  /**
   * Set up file paths
   */
  var _assets_dir     = './assets';
  var _src_dir        = _assets_dir + '/src';
  var _dist_dir       = _assets_dir + '/dist';
  var _dev_dir        = _assets_dir + '/dev';
  var _build_dir      = (is_prod) ? _dist_dir : _dev_dir;


  /**
   * Error notification settings
   */
  function errorAlert(err) {
    $.notify.onError({
      message:  '<%= error.message %>',
      sound:    'Sosumi'
    })(err);
  }


  /**
   * Clean the dist/dev directories
   */
  gulp.task('clean', function() {
    del( _build_dir + '/**/*' );
  });


  /**
   * Concatenates, minifies and renames the source JS files for dist/dev
   */
  gulp.task('scripts', function() {
    var matches = glob.sync(_src_dir + '/js/*');

    if (matches.length) {
      matches.forEach( function(match) {
        var dir     = match.split('/js/')[1];
        var scripts = [
          _src_dir + '/js/' + dir + '/**/*.js'
        ];
        gulp.src(scripts)
          .pipe( $.plumber({ errorHandler: errorAlert }) )
          .pipe( $.concat(dir + '.js') )
          .pipe( is_prod ? $.uglify() : $.util.noop() )
          .pipe( is_prod ? $.rename(dir + '.min.js') : $.util.noop() )
          .pipe( gulp.dest(_build_dir) )
          .pipe( reload({stream:true}) )
          .on( 'error', errorAlert )
          .pipe(
            $.notify({
              message:  (is_prod) ? dir + ' scripts have been compiled and minified' : dir + ' dev scripts have been compiled',
              onLast:   true
            })
          );
      });
    }
  });


  /**
   * Compiles and compresses the source Sass files for dist/dev
   */
  gulp.task('styles', function() {
    var _sass_opts = {
      outputStyle:  is_prod ? 'compressed' : 'expanded',
      sourceComments: !is_prod
    };

    var _postcss_opts = [
      prefix({browsers: ['last 3 versions']})
    ];

    if ( is_prod ) _postcss_opts.push(cssnano());

    gulp.src(_src_dir + '/scss/style.scss')
      .pipe( $.plumber({ errorHandler: errorAlert }) )
      .pipe( $.sass(_sass_opts) )
      .on( 'error', function(err) {
        new $.util.PluginError(
          'CSS',
          err,
          {
            showStack: true
          }
        );
      })
      .pipe( is_prod ? $.rename({ suffix: '.min' }) : $.util.noop() )
      .pipe( postcss(_postcss_opts) )
      .pipe( gulp.dest(_build_dir) )
      .pipe( reload({stream:true}) )
      .on( 'error', errorAlert )
      .pipe(
        $.notify({
          message:  (is_prod) ? 'Styles have been compiled and minified' : 'Dev styles have been compiled',
          onLast:   true
        })
      );
  });


  /**
   * Builds for distribution (staging or production)
   */
  gulp.task('build', [
    'clean',
    'styles'
  ]);


  /**
   * Builds assets and reloads the page when any php, html, img or dev files change
   */
  gulp.task('watch', ['build'], function() {
    browserSync.init({
      server: {
        baseDir: './'
      },
      notify: true
    });

    gulp.watch( _src_dir + '/scss/**/*', ['styles'] );
    gulp.watch( _src_dir + '/js/**/*', ['scripts'] );
    gulp.watch( './**/*.html' ).on('change', reload );
  });

  /**
   * Backup default task just triggers a build
   */
  gulp.task('default', [ 'build' ]);

}());
