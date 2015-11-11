import Ember from 'ember';
import config from '../config/environment';
const $ = Ember.$;
const Promise = Ember.RSVP.Promise;


export default Ember.Component.extend({
  didInsertElement() {
    let doc = this.get('page.document');
    let internalStyles = doc.querySelectorAll('head style');
    let externalStyles = Array.from(doc.querySelectorAll('head link[rel=stylesheet]'));
    externalStyles.forEach(s => {
      let style = $(s);
      let href = style.attr('href');
      if (href) {
        href = href.replace(/^\/\//, location.protocol + '//');
        if (href.indexOf(config.wnycMediaURL) === 0) {
          style.attr('href', href.replace(config.wnycMediaURL, '/wnyc-media'));
        }
        if (href.indexOf('http://cloud.typography.com') === 0) {
          style.attr('href', href.replace('http://cloud.typography.com', '/cloud-typography'));
        }
      }
    });
    let stylesLoaded = externalStyles.map(s => loaded(s));

    this.$()
      .append(internalStyles)
      .append(externalStyles);

    Promise.all(stylesLoaded).finally(() => {
      this.$().append(doc.querySelector('body').children);
    });
  }
});

function loaded(element) {
  return new Promise((resolve, reject) => {
    $(element)
      .on('load', resolve)
      .on('error', reject);
  });
}
