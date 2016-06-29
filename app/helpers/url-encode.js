import { helper } from 'ember-helper';

export function urlEncode(s) {
  return encodeURIComponent(s).replace(/'/g,"%27").replace(/"/g,"%22");
}

export default helper(urlEncode);
