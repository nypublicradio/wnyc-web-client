import {
  create,
  visitable,
  collection,
  text,
  isVisible
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/fake?modal=queue-history'),
  queueIsVisible: isVisible('.player-queue'),
  stories: collection('.sortable-item', {
      title: text('.queueitem-itemtitle'),
  })
});
