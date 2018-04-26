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
  stories: collection({
    itemScope: '.sortable-item',
    item: {
      title: text('.queueitem-itemtitle'),
    }
  })
});
