import PageObject from 'wqxr-web-client/tests/page-object';

let {
  visitable,
  collection,
  text,
  isVisible
} = PageObject;

export default PageObject.create({
  visit: visitable('/fake?modal=queue-history'),
  queueIsVisible: isVisible('.player-queue'),
  stories: collection({
    itemScope: '.sortable-item',
    item: {
      title: text('.queueitem-itemtitle'),
    }
  })
});
