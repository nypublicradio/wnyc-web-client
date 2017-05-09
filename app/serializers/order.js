import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    creditCardLast4Digits: {key: 'credit-card-last-4-digits'}
  }
});
