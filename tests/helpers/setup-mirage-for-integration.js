import mirageInitializer from 'wnyc-web-client/initializers/ember-cli-mirage';

export default function startMirage(container) {
  mirageInitializer.initialize(container);
}
