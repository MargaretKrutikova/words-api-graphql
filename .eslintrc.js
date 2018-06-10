module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "no-console": "off",
    indent: ["error", 2],
    quotes: ["error", "single"],
    "linebreak-style": ["error", "windows"],
    semi: ["error", "always"]
  }
};
