import DS from 'ember-data';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import { totalPages } from '../utils/math-util';

export default DS.Model.extend({
  teaseList: DS.attr(),
  totalCount: DS.attr('number'),
  totalPages: computed('totalCount', {
    get() {
      const total = get(this, 'totalCount');
      return totalPages(total);
    }
  }),
  html: DS.attr('string'),
  body: DS.attr('string'),
  people: DS.attr(),
  social: DS.attr(),
  contentType: DS.attr('string')
});
