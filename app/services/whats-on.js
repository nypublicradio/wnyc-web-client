import Ember from 'ember';

const {
  Service,
  $,
  get,
  RSVP
} = Ember;

const { Promise } = RSVP;

export default Service.extend({
  endPoint: '/api/v1/whats_on',
  isLive(pk) {
    const endPoint = get(this, 'endPoint');

    return new Promise(resolve => {
      $.ajax(endPoint).then(d => {
          const status = this._extractStatus(d, pk);
          resolve(status);
        });
      });
  },

  _extractStatus(data, pk) {
    const stations = Object.keys(data);
    for (let i = 0; i < stations.length; i++) {
      let stationKey = stations[i];
      let station = data[stationKey];
      // for some reason if the what's on story is an EPISODE, it's under episode_pk,
      // but if it's a SEGMENT, that pk is just on pk
      let onAirPk = get(station, 'current_show.episode_pk') || get(station, 'current_show.pk');
      let endtime = get(station, 'current_show.end');

      if (onAirPk === pk) {
        return [true, endtime];
      }
    }

    return [false, false];
  }
});
