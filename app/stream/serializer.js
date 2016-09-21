import DS from 'ember-data';
import { camelizeKeys } from 'overhaul/helpers/camelize-keys';

export default DS.JSONAPISerializer.extend({
  keyForAttribute(key) {
    return key.underscore();
  },

  normalizeFindRecordResponse(store, modelClass, {stream, whatsOn}, ...rest) {
    let json = this._apiFormatStream(stream);
    let transformed = {data: this._attachWhatsOn(json, whatsOn)};
    return this._super(store, modelClass, transformed, ...rest);
  },

  normalizeFindAllResponse(store, modelClass, { streams, whatsOn }, ...rest) {
    streams = streams.results.sort((a, b) => a.id - b.id);
    let data = streams.map((stream) => {
      let json = this._apiFormatStream(stream);
      return this._attachWhatsOn(json, whatsOn[stream.slug]);
    });
    return this._super(store, modelClass, { data }, ...rest);
  },

  _apiFormatStream(data) {
    let keys = [
      'has_playlists', 
      'image_logo', 
      'name',
      'slug',
      'schedule_url',
      'short_description',
      'playlist_url',
      'whats_on'
    ];
    let attributes = {};
    keys.forEach(k => attributes[k] = data[k]);
    attributes.urls = this._findPreferredStreams(data);
    return {
      id: data.slug,
      type: 'stream',
      attributes
    };
  },

  _attachWhatsOn(json, whatsOn) {
    if (!whatsOn) {
      return json;
    }
    
    let {
      attributes,
      relationships
    } = json;
    
    let {
      current_show,
      has_playlists,
      current_playlist_item,
      future
    } = whatsOn;
    
    if (current_show) {
      attributes.current_show = current_show;
      if (current_show.show_title) {
        attributes.current_show.episodeTitle = current_show.title;
        attributes.current_show.episodeUrl = current_show.url;
      } else {
        attributes.current_show.showTitle = current_show.title;
        attributes.current_show.showUrl = current_show.url;
        attributes.current_show.episodeTitle = null;
        attributes.current_show.episodeUrl = null;
      }
      if (current_show.episode_pk) {
        relationships = relationships || {};
        relationships.currentStory = {
          data: {
            type: 'story',
            id: current_show.episode_pk
          }
        };
      }
      if (has_playlists) {
        relationships = relationships || {};
        relationships.playlist = {
          data: {
            type: 'playlist',
            id: json.id
          }
        };
      }
    }
    if (current_playlist_item) {
      attributes.current_playlist_item = camelizeKeys([ current_playlist_item ]);
    }
    if (future) {
      attributes.future = [];
      future.forEach((p, i) => attributes.future[i] = camelizeKeys([ p ]));
    }
      
    json.attributes = attributes;
    json.relationships = relationships;
    return json;
  },

  // given an object with a urls key, return a sorted array with stream mounts 
  // in this order:
  // [hls, icecast aac, icecast mp3]
  _findPreferredStreams({ urls }) {
    if (!urls) {
      return [];
    }
    let { userAgent }   = navigator;
    let browser = {
      mobile  : userAgent.indexOf('Mobile') > -1,
      android : userAgent.indexOf('Android') > -1,
      ios     : userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1
    };
    let { ipod, aac, mp3, mobile_aac, mobile:mobile_mp3 } = urls;
    
    // why are these arrays?
    aac = aac[0];
    mp3 = mp3[0];
    
    // Mobile browsers should receive the AAC and MP3 stream specific to mobile
    // for our analytics.  But if there's no mobile stream, then they
    // should receive the regular AAC/MP3 stream.
    if (browser.mobile || browser.android || browser.ios) {
      aac = mobile_aac ? mobile_aac : aac;
      mp3 = mobile_mp3 ? mobile_mp3 : mp3;
    }
    
    return [ ipod.match(/hls.wnyc.org.*m3u8$/) ? ipod : null, aac, mp3 ].compact();
  }
});
