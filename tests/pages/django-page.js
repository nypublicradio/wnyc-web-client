import PageObject from 'overhaul/tests/page-object';
import { appendHTML } from 'overhaul/tests/helpers/html';

let {
  visitable,
  //clickOnText,
  //clickable,
  //textList,
  //text
} = PageObject;

export default PageObject.create({
  visit: visitable(':id'),
  alienClick(selector) {
    return alienDomClick(selector);
  },

  bootstrap({id}) {
    let djangoPage = server.schema.djangoPages.find(id);
    appendHTML(djangoPage.attrs.text);
    return this;
  }
});
