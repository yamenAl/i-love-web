module.exports = function(eleventyConfig) {
  // Keep default passthroughs and shortcodes if needed
  eleventyConfig.setTemplateFormats(["md","njk","html"]);

  // Add a Nunjucks filter used in templates: returns an array with one random item
  eleventyConfig.addNunjucksFilter("randomItem", function(collection) {
    if (!Array.isArray(collection) || collection.length === 0) return [];
    const idx = Math.floor(Math.random() * collection.length);
    return [collection[idx]];
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes",
      output: "_site"
    }
  };
};
