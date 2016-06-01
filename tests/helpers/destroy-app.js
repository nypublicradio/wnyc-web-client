import Ember from 'ember';

export default function destroyApp(application) {
  Ember.run(application, 'destroy');
  if (typeof server !== 'undefined') {
    server.shutdown();
  }
}
