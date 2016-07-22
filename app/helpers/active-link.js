import { helper } from 'ember-helper';

export function activeLink(linkPath) {
  let path = window.location.pathname;
  if (linkPath[0] === window.location.pathname){
    return "active";  
  }
}

export default helper(activeLink);
