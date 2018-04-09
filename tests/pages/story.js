import {
  create,
  visitable,
  clickable,
  isVisible
} from 'ember-cli-page-object';

export default create({
  visit: visitable('story/:slug'),
  clickShowComments: clickable('[data-test-selector=story-comments]'),
  commentsVisible: isVisible('[data-test-selector=comment-list]')
});
