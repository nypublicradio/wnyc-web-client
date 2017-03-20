import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import registerPowerSelectHelpers from '../../tests/helpers/ember-power-select';

import './alien-dom-click';
import './ember-sortable/test-helpers';
import './google-analytics-stub';

registerPowerSelectHelpers();

export default function startApp(attrs) {
  let application;

  let attributes = Ember.assign({}, config.APP);
  attributes = Ember.assign(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
