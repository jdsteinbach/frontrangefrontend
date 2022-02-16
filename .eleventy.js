module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('_redirects');
  eleventyConfig.addPassthroughCopy('netlify.toml');
  eleventyConfig.addPassthroughCopy('src/assets/img');

  eleventyConfig.addWatchTarget('./src/assets/scss/**/*.scss');

  return {
    templateFormats: [
      'md',
      'html',
      '11ty.js'
    ],
    dir: {
      input: './src',
    }
  }
}
