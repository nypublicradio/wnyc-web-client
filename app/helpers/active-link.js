import { helper } from 'ember-helper';

export function activeLink([ linkPath, currentUrl ]) {
  let regex = new RegExp("^" + linkPath, "i");
  if (currentUrl && currentUrl.match(regex)) {
    return "active";  
  }
}

export default helper(activeLink);
