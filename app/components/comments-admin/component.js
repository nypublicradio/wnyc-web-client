import Ember from 'ember';
import ENV from 'overhaul/config/environment';

export default Ember.Component.extend({
  actions: {
    featureMe() {
      let id = this.get('id');
      let browserId = this.get('browserId');
      let url = `${ENV.wnycAccountAPI}/comments/adminflag/?bust_cache=${Math.random()}&id=${browserId}`;

      let options = {
        type: 'POST',
        url,
        data: {
          comment_id: id
        },
        xhrFields: { withCredentials: true }
      };

      Ember.$.ajax(options).always( d => {
        if ( d.featured ) {
          this.set('isFeatured', true);
        }
      });
    }
  }
});
