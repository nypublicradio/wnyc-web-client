import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import computed, { readOnly } from 'ember-computed';
import { shareMetadata } from 'wqxr-web-client/helpers/share-metadata';

export default Model.extend({
  audioType:            'livestream',

  hasPlaylists:         attr('boolean'),
  imageLogo:            attr('string'),
  scheduleUrl:          attr('string'),
  name:                 attr('string'),
  shortDescription:     attr('string'),
  slug:                 attr('string'),
  whatsOn:              attr('number'),
  position:             attr('number'),
  playlistUrl:          attr('string'),
  cmsPK:                attr('number'),

  currentShow:          attr(),
  currentPlaylistItem:  attr(),
  future:               attr(),
  urls:                 attr(),

  currentStory:         belongsTo('story'),
  playlist:             belongsTo('playlist'),

  story:                readOnly('currentStory'),
  audioBumper:          attr('string'),
  source_tags:          attr('string'), 
  
  isWQXR:               computed('source_tags', function(){
    return this.get('source_tags') === 'wqxr_app';
  }),

  liveWQXR:             computed('isWQXR', 'audioBumper', function(){
    return this.get('isWQXR') && this.get('audioBumper') != null;
  }),


  source_tags:          attr('string'), 
  isWQXR:               computed('source_tags', function(){
    return this.get('source_tags') === 'wqxr_app';
  }),
  liveWQXR:             computed('source_tags', function(){
    return this.get('isWQXR') && this.get('audioBumper') != null;
  }),


  shareMetadata:        computed('currentShow', 'currentPlaylistItem', function() {
    return shareMetadata(this);
  }),
  

  forListenAction(data) {
    return this.get('currentStory').then(s => {
      data.current_audio_position = 0; // stream should always report 0
      return Object.assign({
        audio_type: 'livestream',
        cms_id: s && s.get('id'),
        item_type: s && s.get('itemType'),
        stream_id: this.get('cmsPK'),
      }, data);
    });
  }
});
