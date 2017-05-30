module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "embertest": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-extra-boolean-cast": ["warn"],
    "no-empty": 0,
    "no-console": 0
  },
  "globals": {
    "server": true,
    "imagesLoaded": true
  }
};
