import Ember from 'ember';
import rsvp from 'rsvp';
import { scheduleOnce } from 'ember-runloop';
const { Promise } = rsvp;

export default Ember.Component.extend({
  classNames: ['text-crawl'],
  classNameBindings: ['isScrolling'],
  didRender() {
    let watch = this.get('watch');
    Promise.resolve(watch).then(watch => this.measure(watch));
  },
  measure(watch) {
    if (this._lastWatch !== watch) {
      this._lastWatch = watch;

      scheduleOnce('afterRender', this, function() {
        let toScroll = this.$('.text-crawl-scroll');
        let width = toScroll[0].scrollWidth;
        // stop a running animation if there is one
        toScroll
          .velocity('stop').css('left', 0);

        if (width > this.$().width()) {

          this.set('isScrolling', true);

          toScroll
           .velocity({left: [`-${width - 50}px`, 0]}, {duration: 4500, delay: 750})
           .velocity({left: 0}, {duration: 500, 
             complete: () => {
              if (this.isDestroyed || this.isDestroying) {
                return;
              }
              this.set('isScrolling', false);
            }
          });
        }
      });
    }
  }
});
