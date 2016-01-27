import Ember from 'ember';

const {
  Helper,
  get
} = Ember;

const {capitalize} = Ember.String;

export default Helper.helper(function([id]) {
  const lastItem = get(id.split('/'), 'lastObject')
  return capitalize(lastItem || '') // JIC
})
