import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  type: 'list',
  totalCount() {
    if (this.type === 'about') {
      return 0;
    }
    return this.type === 'list' ? 1000 : 1;
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
