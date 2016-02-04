import PageObject from 'overhaul/tests/page-object';

let {
  visitable,
  clickOnText,
  textList
} = PageObject;

export default PageObject.create({
  visit: visitable(':id'),
  clickNavLink: clickOnText('.tabs-header'),
  storyTitles: textList('[data-test-selector=story-tease-title]')
});
