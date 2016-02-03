import Ember from 'ember';
import PageNumberAddon from 'ember-cli-pagination/components/page-numbers';

const {
  computed,
  get
} = Ember;

export default  PageNumberAddon.extend({
  currentPageClass: computed('currentPage', {
    get() {
      const currentPage = get(this, 'currentPage');

      if(Number(currentPage) === 1) {
        return 'page-one';
      } else {
        return 'pagination';
      }
    }
  })
});
