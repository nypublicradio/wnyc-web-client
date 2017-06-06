import Resolver from 'ember-resolver';

const RE = /^(?:route|template|controller):((show|series|article|tag|blog)-detail)(?:$|[\/-].*)/;

export default Resolver.extend({
  parseName(fullName) {
    if (RE.test(fullName)) {
      let match = RE.exec(fullName);
      return this._super(fullName.replace(match[1], 'channel'));
    }
    return this._super(fullName);
  }
});
