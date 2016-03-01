import PageObject from 'overhaul/tests/page-object';
import serialize from 'overhaul/mirage/utils/serialize';
import { appendHTML } from 'overhaul/tests/helpers/html';

let {
  visitable,
  clickOnText,
  clickable,
  textList,
  text
} = PageObject;

export default PageObject.create({
  visit: visitable(':id'),
  clickNavLink: clickOnText('.tabs-header'),
  storyTitles: textList('[data-test-selector=story-tease-title]'),
  aboutText: text('[data-test-selector=about-page]'),
  storyText: text('[data-test-selector=story-detail]'),
  clickNext: clickable('.pagefooter-next > a'),
  clickBack: clickable('.pagefooter-previous > a'),
  clickPage: clickOnText('.pagefooter-link'),
  bootstrap(show) {
    let showModel = server.schema.show.find(show.id);
    let serializedShow = serialize(showModel);

    appendHTML(`
      <script type="text/x-wnyc-marker" data-url="${show.id}"></script>
    `);

    appendHTML(`
      <script id="wnyc-channel-jsonapi" type="application/vnd.api+json">
        ${JSON.stringify({ [show.id]: serializedShow })}
      </script>
    `);

    return this;
  }
});
