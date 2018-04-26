import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNames: ['story-card__image'],
  attributeBindings: ['style'],
  style: computed('src', function() {
    let src = this.get('src');
    return htmlSafe(`background-image: url(${src})`);
  }),
});
