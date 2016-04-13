import computed from 'ember-computed';
import Component from 'ember-component';

export default Component.extend({
  classNames: ['l-full'],
  classNameBindings: ['cssOverrides'],
  attributeBindings: ['style'],
  style: 'background-color: white; position: relative;',
  type: computed('page', {
    get() {
      let id = this.get('page.id');
      let firstPart = id.split('/')[0];

      switch(firstPart) {
        case '':
          return 'index';
        case 'shows':
        case 'articles':
        case 'series':
        case 'tags':
        case 'blogs':
          return 'channel';
        case 'story':
          return 'story';
        default:
          return 'legacy';
      }
    },
    set(k, v) {
      return v;
    }
  }),
  pageTemplate: computed('type', function() {
    let type = this.get('type');
    return `components/loading-templates/${type}`;
  }),
  cssOverrides: computed('type', function() {
    let type = this.get('type');
    return `${type}-loading`;
  }),
});
