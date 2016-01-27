import Ember from 'ember';
const {
  Helper
} = Ember;

export function producingOrgs([ orgsList ]/*, hash*/) {
  let producingString = ''

  orgsList.forEach((org, idx) => {
    let line = `<a href="${org.url}" target="_blank" class="link link--dark">${org.name}</a>`
    if (idx === orgsList.length - 1) {
      line += '.'
    } else if (idx === orgsList.length - 2){
      line += ' and '
    } else {
      line += ', '
    }

    producingString += line
  })

  return Ember.String.htmlSafe(`Produced by ${producingString}`)
}

export default Helper.helper(producingOrgs);
