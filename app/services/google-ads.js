import Service from 'ember-service';
import { later, schedule } from 'ember-runloop';
import { isEmpty } from 'ember-utils';

export default Service.extend({
  init(googletag = window.googletag) {
    this._super(...arguments);
    this.set('googletag', googletag);
  },
  refresh() {
    let googletag = this.get('googletag');
    if (googletag && googletag.apiReady) {
      schedule('afterRender', this, () => {
        googletag.cmd.push(() => {
          googletag.pubads().refresh();
        });
      });
    } else {
      later(this, 'refresh', 500);
    }
  },  
  doTargeting(story) {
    let googletag = this.get('googletag');
    googletag.cmd.push(function() {
      googletag.pubads().setTargeting('url', window.location.pathname);
      googletag.pubads().setTargeting('host', window.location.host);
      googletag.pubads().setTargeting('fullurl', window.location);
    
      if (story){
        let {
          tags,
          show,
          channel,
          series
        } = story.get('extendedStory');
        
        [['tag', tags], ['show', show], ['channel', channel], ['series', series]].forEach(([k, v]) => {
          if (!isEmpty(v)) {
            googletag.pubads().setTargeting(k, v);
          }
        });
      }
    });  
  }
});
