import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import computed, { readOnly } from 'ember-computed';
import { shareMetadata } from 'wqxr-web-client/helpers/share-metadata';

export default Model.extend({
  audioType:            'stream',

  hasPlaylists:         attr('boolean'),
  imageLogo:            attr('string'),
  scheduleUrl:          attr('string'),
  name:                 attr('string'),
  shortDescription:     attr('string'),
  slug:                 attr('string'),
  whatsOn:              attr('number'),
  position:             attr('number'),
  playlistUrl:          attr('string'),

  currentShow:          attr(),
  currentPlaylistItem:  attr(),
  future:               attr(),
  urls:                 attr(),

  currentStory:         belongsTo('story'),
  playlist:             belongsTo('playlist'),

  story:                readOnly('currentStory'),
  audioBumper:          attr('string'),

  shareMetadata:        computed('currentShow', 'currentPlaylistItem', function() {
    return shareMetadata(this);
  })
});
