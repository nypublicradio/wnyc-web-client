import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  // we're actually returning HTML from our server, so we can't have a rootKey
  root: false,
  // and mirage expects that one of these two props to be true, even though we
  // aren't embedding any records with this request. it just needs to be set
  // to true to work.
  embed: true,
  serialize(response) {
    return response.text;
  }
});
