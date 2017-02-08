import DS from 'ember-data';
import computed from 'ember-computed';

const { Model, attr } = DS;

export default Model.extend({
  fund: attr('string'),
  orderPrice: attr('number'),
  orderDate: attr('string'),
  orderType: attr('string'),
  orderKey: attr('string'),
  premium: attr('string'),
  creditCardType: attr('string'),
  creditCardLast4Digits: attr('string'),
  isActive: attr('boolean'),
  isSustainer: computed('orderType', function() {
    return this.get('orderType') === 'sustainer';
  }),
});
