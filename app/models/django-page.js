import Ember from 'ember';
import DS from 'ember-data';
import config from '../config/environment';
const $ = Ember.$;
const Promise = Ember.RSVP.Promise;

export default DS.Model.extend({
  htmlParser: Ember.inject.service(),
  text: DS.attr(),

  document: Ember.computed('text', function() {
    return this.get('htmlParser').parse(this.get('text'));
  }),

  title: Ember.computed('document', function() {
    let titleTag = this.get('document').querySelector('title');
    if (titleTag) {
      return titleTag.innerHTML;
    }
  }),

  appendStyles($element) {
    let doc = this.get('document');
    let internalStyles = doc.querySelectorAll('head style');
    let externalStyles = Array.from(doc.querySelectorAll('head link[rel=stylesheet]')).map(s => {
      let style = $(s);
      let href = style.attr('href');
      if (href) {
        href = href.replace(/^\/\//, location.protocol + '//');
        if (href.indexOf(config.wnycMediaURL) === 0) {
          style = style.clone();
          style.attr('href', href.replace(config.wnycMediaURL, '/wnyc-media'));
        }
        else if (href.indexOf('http://cloud.typography.com') === 0) {
          style = style.clone();
          style.attr('href', href.replace('http://cloud.typography.com', '/cloud-typography'));
        }
      }
      return style;
    });

    let stylesLoaded = externalStyles.map(s => loaded(s));
    $element.append(internalStyles).append(externalStyles);
    return Promise.all(stylesLoaded);
  },

  appendTo($element) {
    let doc = this.get('document');
    return this.appendStyles($element).finally(() => {
      $element.append($(doc).find('body').children().clone());
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
