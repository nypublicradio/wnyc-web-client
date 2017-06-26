import Ember from 'ember';
import get from 'ember-metal/get';
const {
  Helper
} = Ember;

export function producingOrgs([ orgsList ]/*, hash*/, {unlinked=false}={}) {
  let producingString = '';

  orgsList.forEach((org, idx) => {
    let line = '';
    
    if (unlinked){
      line = get(org,'name');
    } else {
      line = `<a href="${get(org, 'url')}" target="_blank" class="link link--dark">${get(org, 'name')}</a>`;
    }

    if (idx === get(orgsList, 'length') - 2){
      line += ' and ';
    } else if (idx < get(orgsList, 'length') - 1){
      line += ', ';
    }

    producingString += line;
  });

  return Ember.String.htmlSafe(`${producingString}`);
}

export default Helper.helper(producingOrgs);
