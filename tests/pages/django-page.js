import { create, visitable } from 'ember-cli-page-object';
import { appendHTML } from 'wnyc-web-client/tests/helpers/html';

export default create({
  visit: visitable(':path'),

  bootstrap({id}) {
    let djangoPage = server.schema.djangoPages.find(id);
    appendHTML(djangoPage.attrs.text);
    return this;
  }
});
