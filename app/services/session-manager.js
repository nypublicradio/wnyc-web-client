// TODO: wait until we remove wnyc.listening as a dependency
import Ember from 'ember';
//import { getJSONAsPromise } from '../utils/promise-ajax';

const {
  get,
  set,
  Service,
  RSVP,
  isBlank,
  warn,
  run,
  A: emberArray,
  $
} = Ember;
const {
  bind
} = run;

export default Service.extend({
  //getJSONAsPromise,
  _cache: {},
  knownIdentities: emberArray([]),

  findAll() {
    const knownIdentities = get(this, 'knownIdentities');
    const identityNames = knownIdentities.map((identity) => get(identity, 'name'));

    return this._applyToIdentities(identityNames, 'find');
  },

  find(identityName) {
    const _cache = get(this, '_cache');
    //const getJSONAsPromise = get(this, 'getJSONAsPromise');
    const existingIdentity = get(_cache, identityName);
    const endpoint = this._buildURL(identityName);

    if (existingIdentity) {
      return RSVP.resolve(existingIdentity);
    }

    if (isBlank(endpoint)) {
      warn(`Could not find an endpoint registered for ${identityName}`);
      return;
    }

    return $.ajax(endpoint)
    .then(res => {
      set(_cache, identityName, res);
      return res;
    }, error => RSVP.reject(error));
  },

  removeAll() {
    const _cache = get(this, '_cache');
    const identityNames = Object.keys(_cache);

    this._applyToIdentities(identityNames, 'remove', false);
  },

  remove(identityName) {
    const _cache = get(this, '_cache');
    const existingIdentity = get(_cache, identityName);

    if (existingIdentity) {
      delete _cache[identityName];
    }
  },

  _buildURL(identityName) {
    const knownIdentities = get(this, 'knownIdentities');
    const identity = knownIdentities.findBy('name', identityName);
    const endpoint = get(identity, 'endpoint');

    return endpoint;
  },

  _applyToIdentities(identityNames, operationName = null, async = true) {
    if (isBlank(operationName)) {
      warn('operationName cannot be blank');
      return RSVP.reject();
    }

    if (isBlank(identityNames)) {
      warn('No identityNames were found');
      return RSVP.reject();
    }

    const performOperationOn = bind(this, operationName);
    const promise = {};

    identityNames.forEach((identityName) => {
      promise[identityName] = performOperationOn(identityName);
    });

    if (async) {
      return RSVP.hash(promise);
    }
  },

  willDestroy() {
    const knownIdentities = get(this, 'knownIdentities');

    set(this, '_cache', {});
    knownIdentities.clear();
  }
});
