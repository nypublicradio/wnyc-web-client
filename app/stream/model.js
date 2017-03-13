import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import computed, { readOnly } from 'ember-computed';
import { shareMetadata } from 'wqxr-web-client/helpers/share-metadata';

const WQXR_slugs = ["wqxr","q2","jonathan-channel","wqxr-special","wqxr-special2"];
// wqxr-special = Operavore, 
// wqxr-special2 = Holiday Channel

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
  
  isWQXR:               computed('slug', function(){
    return WQXR_slugs.indexOf(this.get('slug')) > -1;
  }),

  liveWQXR:             computed('isWQXR', 'whatsOn', function(){
    return this.get('isWQXR') && (this.get('whatsOn') > 0);
  }), 

  shareMetadata:        computed('currentShow', 'currentPlaylistItem', function() {
    return shareMetadata(this);
  }),
  

  forListenAction(data) {
    return this.get('currentStory').then(s => {
      return Object.assign({
        audio_type: 'stream',
        cms_id: s && s.get('id'),
        site_id: s && s.get('siteId'),
        item_type: s && s.get('itemType'),
        stream_id: this.get('id')
      }, data);
    });
  }
});
