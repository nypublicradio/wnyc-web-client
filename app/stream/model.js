import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { readOnly } from 'ember-computed';

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
  bbModel:              attr(),

  currentStory:         belongsTo('story'),
  playlist:             belongsTo('playlist'),

  story:                readOnly('currentStory')
});
