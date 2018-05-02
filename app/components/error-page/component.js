import { readOnly, equal } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  errorType: readOnly('error.response.status'),
  pageNotFound: equal('errorType', 404),
  serverError: equal('errorType', 500)
});
