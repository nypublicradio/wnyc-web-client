import DS from 'ember-data';
import computed from 'ember-computed';

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
  isSustainer: attr('boolean'),
  updateLink: computed('fund', function() {
    let pledgeDomain = this.get('fund') === 'WQXR' ? 'wqxr' : 'wnyc';
    let fundSlug = this.get('fund').toLowerCase().replace(/[\.\ ]/g, '');
    return `https://pledge3.${pledgeDomain}.org/donate/mc-${fundSlug}`;
  })
});
