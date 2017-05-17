module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "indent": ["warn", 2],
    "linebreak-style": ["error", "unix"],
    "semi": ["error", "always"],
    "quotes": "off",
    "no-console": "off",
    "camelcase": ["warn", {properties: "always"}],
    "no-unused-vars": "off",
  }
};
