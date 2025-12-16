module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("robots.txt");

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts"
    }
  };
};