module.exports = {
  env: { browser: true, es6: true, node: true },
  extends: "eslint:recommended",
  parserOptions: { sourceType: "module" },
  rules: {
    indent: [ "error", 2 ],
    "linebreak-style": [ "error", "unix" ],
    quotes: [ "error", "double", { avoidEscape: true } ],
    semi: [ "error", "always" ]
  }
};
