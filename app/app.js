import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

let App;
let RE = /^(?:route|template):(shows|series|articles|tags)/;

let NYPRResolver = Resolver.extend({
  parseName(fullName) {
    if (RE.test(fullName)) {
      let match = RE.exec(fullName);
      return this._super(fullName.replace(match[1], 'channel'));
    }
    return this._super(fullName);
  }
});


Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: NYPRResolver
});

loadInitializers(App, config.modulePrefix);

export default App;
