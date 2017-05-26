module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  rules: {
    "no-extra-boolean-cast": ["warn"]
  },
  env: {
    browser: true
  },
  rules: {
  },
  globals: {
    server: true
  }
};
