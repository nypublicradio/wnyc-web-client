import PageObject from 'wnyc-web-client/tests/page-object';

let {
  visitable,
  clickable,
  isVisible
} = PageObject;

export default PageObject.create({
  visit: visitable('story/:slug'),
  clickShowComments: clickable('[data-test-selector=story-comments]'),
  commentsVisible: isVisible('article', {scope: '[data-test-selector=comment-list]'})
});
