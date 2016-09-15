import DS from 'ember-data';
import Ember from 'ember';

// bbModel needs getMimeTypes
const { isArray } = Ember;
const agent   = navigator.userAgent;
const browser = {
    mobile  : agent.indexOf('Mobile') > -1,
    android : agent.indexOf('Android') > -1,
    ios     : agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1
  };
const getMimeTypes = function() {
  var urls = this.get('urls');
  if (urls == null) { return; }
  var mimeTypes = [];
  var mobileMP3StreamWasUsed = false;
  // Mobile browsers should receive the MP3 stream specific to mobile
  // for our analytics.  But if there's no mobile stream, then they
  // should receive the regular MP3 stream.
  // this gets around firewalls blocking AAC streams at WNYC HQ
  if ((browser.mobile || browser.android || browser.ios) && urls.mobile) {
    var mp3Mobile = urls.mobile;
    if (!isArray(mp3Mobile)) {
      // why are these urls exposed as Arrays to the rest of the app?
      mp3Mobile = [mp3Mobile];
    }
    mimeTypes.push({ type: 'audio/mpeg', url: mp3Mobile });
    mobileMP3StreamWasUsed = true;
  }
  if (!mobileMP3StreamWasUsed && isArray(urls.mp3) && urls.mp3.length > 0) {
      mimeTypes.push({ type: 'audio/mpeg', url: urls.mp3 });
  }
  if (isArray(urls.aac) && urls.aac.length > 0) {
    mimeTypes.push({ type: 'audio/aac', url: urls.aac });
  }
  return mimeTypes;
};

export default DS.JSONAPISerializer.extend({
  normalizeFindRecordResponse(store, primaryModelClass, payload/*, id, requestType*/) {
    let jsonData = this._apiFormatStream(payload.stream);
    return {data: this._attachWhatsOn(jsonData, payload.whatsOn)};
  },
  normalizeFindAllResponse(store, primaryModelClass, payload/*, id, requestType*/) {
    payload.streams = payload.streams.results.sort((a, b) => a.id - b.id);
    payload.data = payload.streams.map((stream) => {
      let jsonData = this._apiFormatStream(stream);
      return this._attachWhatsOn(jsonData, payload.whatsOn[stream.slug]);
    });
    delete payload.streams;
    delete payload.whatsOn;
    return payload;
  },
  _copyCamelizedKeys(source, target) {
    Object.keys(source).forEach(function(key) {
      target[key.camelize()] = source[key];
    });
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
    let jsonData = {
      id: data.slug,
      type: 'stream',
      attributes: {}
    };
    jsonData.attributes.bbModel = data;
    jsonData.attributes.bbModel.getMimeTypes = getMimeTypes;
    this._copyCamelizedKeys(attributes, jsonData.attributes);
    delete jsonData.attributes.id;
    return jsonData;
  },
  _attachWhatsOn(jsonData, whatsOn) {
    if (whatsOn) {
      if (whatsOn.current_show) {
        jsonData.attributes.currentShow = {};
        this._copyCamelizedKeys(whatsOn.current_show, jsonData.attributes.currentShow);
        if (whatsOn.current_show.show_title) {
          jsonData.attributes.currentShow.episodeTitle = whatsOn.current_show.title;
          jsonData.attributes.currentShow.episodeUrl = whatsOn.current_show.url;
        } else {
          jsonData.attributes.currentShow.showTitle = whatsOn.current_show.title;
          jsonData.attributes.currentShow.showUrl = whatsOn.current_show.url;
          jsonData.attributes.currentShow.episodeTitle = null;
          jsonData.attributes.currentShow.episodeUrl = null;
        }
        if (whatsOn.current_show.episode_pk) {
          jsonData.relationships = jsonData.relationships || {};
          jsonData.relationships.currentStory = {
            data: {
              type: 'story',
              id: whatsOn.current_show.episode_pk
            }
          };
        }
        if (whatsOn.has_playlists) {
          jsonData.relationships = jsonData.relationships || {};
          jsonData.relationships.playlist = {
            data: {
              type: 'playlist',
              id: jsonData.id
            }
          };
        }
      }
      if (whatsOn.current_playlist_item) {
        jsonData.attributes.currentPlaylistItem = {};
        this._copyCamelizedKeys(whatsOn.current_playlist_item, jsonData.attributes.currentPlaylistItem);
      }
      if (whatsOn.future) {
        jsonData.attributes.future = [];
        whatsOn.future.forEach((playlistItem, index) => {
          jsonData.attributes.future[index] = {};
          this._copyCamelizedKeys(playlistItem, jsonData.attributes.future[index]);
        });
      }
    }
    return jsonData;
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
    let { ipod, mobile_aac, aac, mp3 } = urls;
    aac = aac[0];
    mp3 = mp3[0];
    
    // Mobile browsers should receive the AAC stream specific to mobile
    // for our analytics.  But if there's no mobile stream, then they
    // should receive the regular AAC stream.
    if ((browser.mobile || browser.android || browser.ios) && mobile_aac) {
      aac = mobile_aac;
    }
    
    return [ ipod.match(/hls.wnyc.org.*m3u8$/) ? ipod : null, aac, mp3 ].compact();
  }
});
