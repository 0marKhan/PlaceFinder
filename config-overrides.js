// config-overrides.js
const { override } = require("customize-cra");

module.exports = override({
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      zlib: require.resolve("browserify-zlib"),
    };
    return config;
  },
});
