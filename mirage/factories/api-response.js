import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  type: 'list',
  teaseList: [],
  story: null,
  totalCount() {
    return this.teaseList ? this.teaseList.length : 0;
  },
  //teaseList() {
  //  if (this.type === 'list') {
  //    return server.createList('story', 50);
  //  }
  //},
  //story() {
  //  if (this.type === 'story') {
  //    return server.create('story');
  //  }
  //},
});
