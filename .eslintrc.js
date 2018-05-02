module.exports = {
  globals: {
    server: true,
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
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
  },
  overrides: [
    // node files
    {
      files: [
        'testem.js',
        'ember-cli-build.js',
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    }
  ]
};
