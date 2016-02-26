/* globals wnyc */
import Metrics from 'ember-metrics/services/metrics';
import Ember from 'ember';
import service from 'ember-service/inject';
import { firstLessThan } from '../utils/math-util';

const {
  $,
  run,
  get
} = Ember;

//
// Extending the ember-metrics service instead of the base adapter because
// EM's GA adapter extends EM's base adapter, and if we extended EM's base adapter,
// then the GA adapter would not inherit our additions
// So we put these custom tracking methods on the service.
//
export default Metrics.extend({
  router: service('-routing'),
  toStringExtension() {
    return 'base';
  },

  trackBrowser() {
    const windowBoundaries = [400, 800, 1024, 1280, 1366, 1440, 1680];
    const width = firstLessThan(windowBoundaries, window.innerWidth);
    const height = firstLessThan(windowBoundaries, window.innerHeight);

    this.trackEvent({
      category: 'browser properties',
      action: 'window.width',
      label: width,
      value: window.innerWidth,
      nonInteraction: true // non-interaction event
    });

    this.trackEvent({
      category: 'browser properties',
      action: 'window.height',
      label: height,
      value: window.innerHeight,
      nonInteraction: true // non-interaction event
    });
  },

  trackStory(story) {
    const showTitle = get(story, 'headers.brand.title');
    const storyTitle = get(story, 'title');
    const analyticsObject = this.parseAnalyticsCode(get(story, 'analyticsCode'));
    const router = get(this, 'router');
    const currentChannel = router.get('currentState.routerJsState.params.channel.channel');

    this.trackEvent({
      category: 'Web Page',
      action: `Viewed Story of Show "${showTitle}"`,
      label: storyTitle
    });

    if (analyticsObject.seriesslugs) {
      analyticsObject.seriesslugs.forEach(s => {
        if (currentChannel === s) {
          this.trackEvent({
            category: 'Web Page',
            action: `Viewed Story in Series "${s}"`,
            label: storyTitle
          });
        }
      });
    }

    if (analyticsObject.haschannel) {
      analyticsObject.channelslugs.forEach(s => {
        if (currentChannel === s) {
          this.trackEvent({
            category: 'Web Page',
            action: `Viewed Story in Channel "${s}"`,
            label: storyTitle
          });
        }
      });
    }

    run.later(this, () => window.location = get(story, 'url'), 100);
  },

  trackProvenance(e) {
    var TARGET_PROVENANCES = [
        'related',
        'series',
        'segments'
      ],
      delegate = e.currentTarget,
      provenance = delegate.id,
      $clickedEl = $(e.target),
      // what semantic category can classify this click?
      category = $clickedEl.closest('[data-category]').attr('data-category'),
      // what is the action?
      action = '<story page>:' + document.location.pathname + ':' + provenance,
      // might override this below depending on the provenance
      //label = wnyc.current_item.analyticsString,
      label = '',
      // how long have we been on this page when this click occurred?
      value = Math.round( (Date.now() - wnyc.loadtime) / 1000),
      data;

    if (!category) {
      if (!!$clickedEl.closest('[href]').length) {
        // you've either clicked a link
        category = 'Link';
      } else {
        // or else clicked somewhere we aren't tracking
        return;
      }
    }

    if (TARGET_PROVENANCES.indexOf(provenance) !== -1) {
      // current provenance leads to a different analytics target
      label = 'TARGET ANALYTICS CODE';
    }

    data = {
      eventName: 'experimentalSend',
      category: category,
      action: action,
      label: label,
      value: value
    };

    this.trackEvent(data);
  },
});
