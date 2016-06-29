import { helper } from 'ember-helper';

export function imageTemplate([template, x, y, crop]) {
  function replaceFn(originalString, base, path) {
    return `${base}/${x}/${y}/${crop}/99/${path}`;
  }

  return template.replace(/(.*\/i)\/%s\/%s\/%s\/%s\/(.*)/, replaceFn);
}

export default helper(imageTemplate);
