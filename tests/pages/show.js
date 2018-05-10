import {
  create,
  visitable,
  clickOnText,
  clickable,
  text,
  isVisible
} from 'ember-cli-page-object';

export default create({
  visit: visitable(':id'),
  clickNavLink: clickOnText('.nav-links'),
  storyTitles: text('[data-test-selector=story-tease-title]', {multiple: true}),
  aboutText: text('[data-test-selector=about-page]'),
  storyText: text('[data-test-selector=story-detail]'),
  clickNext: clickable('.pagefooter-next > a'),
  clickBack: clickable('.pagefooter-previous > a'),
  clickPage: clickOnText('.pagefooter-link'),
  facebookIsVisible: isVisible('a[href="http://facebook.com"]')
});
