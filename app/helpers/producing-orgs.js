import Ember from 'ember';
const {
  Helper
} = Ember;

export function producingOrgs([ orgsList ]/*, hash*/, {unlinked=false}={}) {
  let producingString = '';

  orgsList.forEach((org, idx) => {
    let line = '';
    
    if (unlinked){
      line = org.name;
    } else {
      line = `<a href="${org.url}" target="_blank" class="link link--dark">${org.name}</a>`;
    }

    if (idx === orgsList.length - 2){
      line += ' and ';
    } else if (idx < orgsList.length - 1){
      line += ', ';
    }

    producingString += line;
  });

  return Ember.String.htmlSafe(`${producingString}`);
}

export default Helper.helper(producingOrgs);
