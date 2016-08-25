import { helper } from 'ember-helper';

export function songMetadata([ catalogEntry ]){
  let metadata = catalogEntry.title;
  if (catalogEntry.composer) {
    metadata += `, ${catalogEntry.composer.name}`;
  }
  catalogEntry.soloists.forEach(function(soloist) {
    metadata += `, ${soloist.musician.name}`;
    if (soloist.instruments.length > 0) {
       metadata += ` (${soloist.instruments[0]})`;
    }
  });
  return metadata;
}

export default helper(songMetadata);
