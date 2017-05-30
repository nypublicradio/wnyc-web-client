module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  rules: {
    "no-extra-boolean-cast": ["warn"],
    "no-empty": 0,
    "no-console": 0
  },
  env: {
    browser: true
  },
  globals: {
    server: true,
    imagesLoaded: true
  }
};
