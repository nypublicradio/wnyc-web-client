import { capitalize } from '@ember/string';
import Helper from '@ember/component/helper';
import { get } from '@ember/object';

export default Helper.helper(function([id]) {
  const lastItem = get(id.split('/'), 'lastObject');
  return capitalize(lastItem || ''); // JIC
});
