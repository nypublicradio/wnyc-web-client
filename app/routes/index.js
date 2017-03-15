import Route from 'ember-route';

export default Route.extend({
  classNames: ['home'],

  model() {
    return this.get('store').findRecord('bucket', 'wqxr-home').then(bucket => {
      return {
        featuredItems: bucket.get('bucketItems').slice(0, 8),
        otherItems: bucket.get('bucketItems').slice(8)
      };
    });
  }
});
