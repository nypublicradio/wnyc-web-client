import Ember from 'ember';
const { helper } = Ember.Helper;

export default helper(function([ catalogEntry ]){
    let metadata = `${catalogEntry.title}, ${catalogEntry.composer.name}`;
    catalogEntry.soloists.forEach(function(soloist) {
      metadata += `, ${soloist.musician.name}`;
      if (soloist.instruments.length > 0) {
         metadata += ` (${soloist.instruments[0]})`;
      }
    });
    return metadata;
});
