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

  bootstrap({id}) {
    let djangoPage = server.schema.djangoPage.find(id);
    appendHTML(djangoPage.attrs.text);
    return this;
  }
});
