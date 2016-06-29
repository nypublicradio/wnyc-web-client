import DS from 'ember-data';
import Ember from 'ember';

export default DS.Serializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id /*, requestType */) {
    let attributes = {};
    if (payload instanceof Document) {
      let doc;
      if (Ember.testing) {
        doc = document.implementation.createHTMLDocument();
        doc.body.appendChild(payload.querySelector('#ember-testing').cloneNode(true));
      } else {
        doc = payload.documentElement.cloneNode(true);
      }
      let emberAssets = [];

      // By this point, ember has already booted a view into the Document, so
      // we need to clean it from the version we save as our data model, otherwise
      // we get problems from recursive ember views and ember trying to boot again
      Array.from(doc.querySelectorAll('.ember-view')).forEach(n => emberAssets.push(n));
      emberAssets.push(doc.querySelector('script[src*="assets/vendor"]'));
      emberAssets.push(doc.querySelector('script[src*="assets/overhaul"]'));
      emberAssets.push(doc.querySelector('link[href*="assets/vendor"]'));
      emberAssets.push(doc.querySelector('link[href*="assets/overhaul"]'));

      emberAssets.forEach(n => n && n.parentNode.removeChild(n));
      attributes.inlineDocument = doc;
    } else {
      attributes.text = payload;
    }

    return {
      data: {
        type: 'django-page',
        id,
        attributes,
      }
    };
  }
});
