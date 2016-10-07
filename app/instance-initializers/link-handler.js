// based on https://github.com/intercom/ember-href-to/blob/master/app/instance-initializers/browser/ember-href-to.js
import ENV from 'overhaul/config/environment';
import Ember from 'ember';
import { canonicalize } from 'overhaul/services/script-loader';
import { beforeTeardown } from 'overhaul/lib/compat-hooks';
const { $ } = Ember;
let { wnycURL } = ENV;
wnycURL = canonicalize(wnycURL);

function _trackEvent(data, instance) {
  let metrics = instance.lookup('service:metrics');
  let category = data.trackingCategory;
  let action   = data.trackingAction;
  let analyticsCode  = '';
  let model = null;
  if (data.trackingModel) {
    let store = instance.lookup('service:store');
    model = store.peekRecord('story', data.trackingModel);
  }
  let region   = data.trackingRegion;
  let label    = data.trackingLabel;
  // If a custom tracking label is set on the link, use that
  if (!label) {

    // format label as either 'code', 'region:code', or just 'region',
    // depending on what we have
    if (model) {
      label = analyticsCode = model.get('analyticsCode');
    }
    if (analyticsCode && model) {
      label = `${region}:${analyticsCode}`;
    } else if (region) {
      label = region;
    }
  }
  let eventToTrack = {category, action};
  // don't add empty properties to events
  if (label) {
    eventToTrack.label = label;
  }
  if (model) {
    eventToTrack.model = model;
  }
  metrics.trackEvent(eventToTrack);
}

function _trackLegacyEvent(event, instance) {
  let legacyAnalytics = instance.lookup('service:legacy-analytics');
  legacyAnalytics.dispatch(event);
}

export function normalizeHref(node, base = location) {
  let href = node.getAttribute('href') || '';
  let url = new URL(href, base).toString();
  let isExternal = false;
  if ( href.startsWith('#') ||  href.startsWith('mailto:')) {
    href = href;
  } else if (url.startsWith(wnycURL)) {
    href = url.replace(wnycURL, '').replace(/^\//, '') || '/';
  } else if (!href.startsWith('/')) {
    href = '';
    isExternal = true;
  }
  return {url, href, isExternal};
}

export function shouldHandleLink(node, base = location) {
  let { href } = normalizeHref(node, base);
  if (node.getAttribute('target') === '_blank') {
    // ignore links bound for a new window
    return false;
  } else if (Array.from(node.classList).contains('ember-view')) {
    // ignore clicks from ember components
    return false;
  } else if (node.getAttribute('data-ember-action')) {
    // ignore clicks from ember actions
    return false;
  } else if (!href || href.startsWith('#') || href.startsWith('?') || href.startsWith('mailto:')) {
    // ignore href-less or otherwise implemented links
    return false;
  } else if (href.split('.').length > 1) {
    // ignore hrefs with a file extension
    return false;
  }
  return true;
}

export default {
  name: 'link-handler',
  initialize: function(instance) {
    let router = instance.lookup('service:wnyc-routing');
    let $body = $(document.body);

    $body.off('click.href-to', 'a');
    // TODO: abstract from django component
    $body.on('click.href-to', 'a', function(event) {
      let { currentTarget, preventDefault } = event;
      let { url, href, isExternal } = normalizeHref(currentTarget);
      let validLink = shouldHandleLink(currentTarget);
      let $target = $(currentTarget);

      // track the click
      if ($target.data('trackingCategory') && $target.data('trackingAction')) {
        _trackEvent($target.data(), instance);
      }

      if (validLink) {

        if ($target.closest('.django-content').length > 0 ) {
          _trackLegacyEvent(event, instance);
        }

        if (url === location.toString()) {
          // could be a valid link, but we still want to short circuit if we'll
          // route to the current page
          return false;
        }

        let { routeName, params, queryParams } = router.recognize(href);
        router.transitionTo(routeName, params, queryParams);
        preventDefault();

        beforeTeardown();
        return false;
      } else if (isExternal && !Ember.testing) {
        $target.attr('target', '_blank');
      }
      return true;
    });
  }
};
