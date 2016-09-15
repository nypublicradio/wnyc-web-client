import DS from 'ember-data';

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
