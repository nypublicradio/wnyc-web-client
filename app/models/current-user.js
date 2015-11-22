import DS from 'ember-data';
const { attr } = DS;

export default DS.Model.extend({
  username: attr('string'),
  isStaff: attr('boolean'),
  name: attr('string'),
  adminUrl: attr('string'),
  email: attr('string'),
  isAuthenticated: attr('boolean'),
  attributes: attr(),
  avatars: attr()
});
