import PageObject from 'wqxr-web-client/tests/page-object';
import { appendHTML } from 'wqxr-web-client/tests/helpers/html';
let {
  visitable,
  //clickOnText,
  //clickable,
  //textList,
  //text
} = PageObject;

export default PageObject.create({
  visit: visitable(':id'),

  bootstrap({id}) {
    /* eslint-disable */
    let djangoPage = server.schema.djangoPages.find(id);
    /* eslint-enable */
    appendHTML(djangoPage.attrs.text);
    return this;
  }
});
