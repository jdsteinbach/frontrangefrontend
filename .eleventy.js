const dateFns = require('date-fns-tz');

module.exports = eleventyConfig => {
  eleventyConfig.addFilter('raw', o => JSON.stringify(o, null, 2));

  eleventyConfig.addFilter('fdate', (date, tz) => {
    const d = dateFns.zonedTimeToUtc(date, tz);
    return dateFns.format(d, 'MMMM d, y');
  });

  eleventyConfig.addFilter('ftime', (date, tz) => {
    const d = dateFns.zonedTimeToUtc(date, tz);
    return dateFns.format(d, 'h:mm aa');
  });

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
