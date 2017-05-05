import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
  fund: attr('string'),
  orderPrice: attr('number'),
  orderDate: attr('string'),
  orderCode: attr('string'),
  orderType: attr('string'),
  orderKey: attr('string'),
  premium: attr('string'),
  creditCardType: attr('string'),
  creditCardLast4Digits: attr('string'),
  isActiveMember: attr('boolean'),
  isSustainer: attr('boolean')
});
