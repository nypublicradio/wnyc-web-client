import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  type: 'list',
  totalCount() {
    if (this.type === 'about') {
      return 0;
    }
    return this.type === 'list' ? 1000 : 1;
  },
  teaseList() {
    if (this.type === 'list') {
      return server.schema.story.find(server.createList('story', 50).mapBy('id'));
    }
  },
  story() {
    if (this.type === 'story') {
      return server.schema.story.find(server.create('story').id)
    }
  },
});
