import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  type: 'list',
  teaseList: [],
  story: null,
  totalCount() {
    return this.teaseList ? this.teaseList.length : 0;
  },
});
