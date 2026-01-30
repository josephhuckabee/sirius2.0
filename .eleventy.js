const yaml = require('js-yaml');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/css/");
    eleventyConfig.addWatchTarget("./src/css/");
    eleventyConfig.addPassthroughCopy("./src/images/");
    eleventyConfig.addPassthroughCopy("./src/js/");
    eleventyConfig.addCollection("navOrdered", function(collectionApi) {
      return collectionApi.getFilteredByTag("navItem").sort((a, b) => {
        const aOrder = typeof a.data.navOrder === "number" ? a.data.navOrder : 999;
        const bOrder = typeof b.data.navOrder === "number" ? b.data.navOrder : 999;
        return aOrder - bOrder;
      });
    });

    // Return your Object options:
    return {
      markdownTemplateEngine: 'njk',
      dir: {
        input: "src",
        output: "public"
      }
    }
};
