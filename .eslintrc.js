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
    "imagesLoaded": true,
    "setBreakpoint": true,
    "server": true,
    "drag": true,
    "document": true,
    "window": true,
    "location": true,
    "setTimeout": true,
    "$": true,
    "-Promise": true,
    "define": true,
    "console": true,
    "visit": true,
    "exists": true,
    "fillIn": true,
    "click": true,
    "keyEvent": true,
    "pauseTest": true,
    "triggerEvent": true,
    "find": true,
    "findWithAssert": true,
    "wait": true,
    "DS": true,
    "andThen": true,
    "currentURL": true,
    "currentPath": true,
    "currentRouteName": true,
    "withFeature": true,
    "alienDomClick": true
  }
};
