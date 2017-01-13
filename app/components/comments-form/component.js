import Ember from 'ember';
import ENV from 'wnyc-web-client/config/environment';
import fetch from 'fetch';

export default Ember.Component.extend({
  name: Ember.computed.reads('user.username'),
  tagName: 'form',
  classNames: ['form'],
  classNameBindings: ['isSaved:is-fadeout'],


  securityURL: Ember.computed('story', 'browserId', function() {
    let story = this.get('story');
    let browserId = this.get('browserId');
    return story.commentSecurityURL(browserId);
  }),

  didInsertElement() {
    this.auth = fetch(this.get('securityURL'), {
      credentials: 'include'
    }).then(response => response.json());
  },
  hasErrors() {
    var requiredFields = [
      'name',
      'comment'
    ];

    if ( !this.get('isStaff') ) {
      requiredFields.push('email');
    }

    this.set('errors', {});

    requiredFields.forEach(function(field) {
      var val = this.get(field);
      if ( !val ) {
        this.set(`errors.${field}`, 'This field is required');
      }
    }, this);

    return Object.keys(this.get('errors')).length !== 0;
  },

  actions: {
    sendComment() {
      this.set('isDisabled', true);
      if (this.hasErrors()) {
        this.set('isDisabled', false);
        return false;
      }
      let data = this.$().serialize();
      this.auth.then(({ security_hash, timestamp }) => {
        let url = `${ENV.wnycAccountRoot}/comments/post/?bust_cache=${Math.random()}&id=${this.get('browserId')}`;
        let story = this.get('story');
        let metaData = {
          content_type: 'cms.' + story.get('itemType'),
          object_pk: story.get('id'),
          timestamp,
          security_hash,
          site: 1,
          honeypot: 'Dave'
        };
        let options = {
          type: 'PUT',
          url,
          xhrFields: { withCredentials: true },
          data: data + '&' + Ember.$.param(metaData)
        };
        Ember.$.ajax(options).always(function(response) {
          if ( response.errors ) {
            this.set('errors', response.errors);
            this.set('isDisabled', false);
          } else {
            this.set('isSaved', true);
            this.sendAction();
          }
        }.bind(this));
      });
    }
  }
});
