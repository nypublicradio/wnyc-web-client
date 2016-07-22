import { helper } from 'ember-helper';

export function activeLink(params) {
  let [linkPath, currentUrl] = params;
  let regex = new RegExp("^" + linkPath, "i");
 // if the first part of the pathname matches the url, set active
  if (currentUrl.match(regex)) {
    return "active";  
  }
}

export default helper(activeLink);
