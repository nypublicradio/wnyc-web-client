import ENV from '../config/environment';

const {
  googleAnalyticsKey: id,
  wnycAccountRoot
} = ENV;

export function initialize(applicationInstance) {
  // Don't run setup if there are no configured metrics adapters.
  if (!id) {
    return false;
  }

  const metrics = applicationInstance.lookup('service:metrics');
  const endpoint = 'api/v1/analytics/ga';
  const mailchimp = String(window.location).match(/utm_term=(\d+_\w+-\w+-\w+)/);

  metrics.activateAdapters([{
    name: 'DataWarehouse',
    config: {
      host: wnycAccountRoot,
      endpoint: endpoint,
      debug: /alertTracking/.test(window.location.search)
    }
  }, {
    name: 'GoogleAnalytics',
    config: {
      id
    }
  }]);

  if (mailchimp !== null) {
    metrics.trackEvent('DataWarehouse', {
      eventName: 'trackMailChimpID',
      mailchimp: encodeURIComponent(mailchimp[1])
    });
  }
}

export default {
  name: 'metrics',
  initialize
};
