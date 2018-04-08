import { create, visitable } from 'ember-cli-page-object';
import { appendHTML } from 'wnyc-web-client/tests/helpers/html';

export default create({
  visit: visitable('/'),

  bootstrap() {
    let djangoPage = server.schema.djangoPages.find('/');
    appendHTML(djangoPage.attrs.text);
    return this;
  }
});
