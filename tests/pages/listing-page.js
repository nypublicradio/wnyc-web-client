import { create, visitable } from 'ember-cli-page-object';
import { appendHTML } from 'wnyc-web-client/tests/helpers/html';

export default create({
  visit: visitable('shows/:slug'),

  bootstrap({id}) {
    /* eslint-disable */
    let djangoPage = server.schema.djangoPages.find(id);
    /* eslint-enable */
    appendHTML(djangoPage.attrs.text);
    return this;
  }
});
