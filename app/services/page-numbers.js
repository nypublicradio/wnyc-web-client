import Ember from 'ember';

const {
  Service
} = Ember;

export default Service.extend({
  page: 1,
  perPage: 10,
  totalPages: 0
});
