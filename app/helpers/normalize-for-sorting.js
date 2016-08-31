import { helper } from 'ember-helper';

export function normalizeForSorting([ title ]/*, hash */) {
  let articles = ['the', 'a', 'an'];
  let ignorePattern = new RegExp(`^(${articles.join('|')}) `, 'i');
  return title.toLowerCase().replace(ignorePattern, '').trim();
}

export default helper(normalizeForSorting);
