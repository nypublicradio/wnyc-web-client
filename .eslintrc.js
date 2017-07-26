module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  "rules": {
    "no-extra-boolean-cast": ["warn"],
    "no-empty": 0,
    "no-console": 0
  },
  "globals": {
    "server": true,
    "imagesLoaded": true,
    "setBreakpoint": true,
    "drag": true,
    "withFeature": true,
    "alienDomClick": true
  }
};
