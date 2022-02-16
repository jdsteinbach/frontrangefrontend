module.exports = eleventyConfig => {
  eleventyConfig.addCollection('rows', collection => {
    return collection
      .getAll()
      .filter(r => r.inputPath.match(/\/rows\//) !== null)
      .sort((a, b) => a.data.order - b.data.order);
  });

  eleventyConfig.addCollection('nav', collection => {
    return collection
      .getAll()
      .filter(r => r.inputPath.match(/\/rows\//) !== null && r.data.title !== undefined)
      .sort((a, b) => a.data.order - b.data.order);
  });


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
