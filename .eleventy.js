module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Sitemap plugin
  const sitemap = require("@quasibit/eleventy-plugin-sitemap");
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://sinztools.app",
      lastModifiedProperty: "modified",
      sitemapFunction: (collection) => {
        return collection.getAll().filter(item => item.url && !item.url.includes('/tags/'));
      }
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts"
    }
  };
};