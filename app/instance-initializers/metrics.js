import ENV from 'overhaul/config/environment';

const {
  googleAnalyticsKey: id,
  wnycAccountRoot
} = ENV;

export function initialize(applicationInstance) {
  const metrics = applicationInstance.lookup('service:metrics');
  const endpoint = 'api/v1/analytics/ga';
  const mailchimp = String(window.location).match(/utm_term=(\d+_\w+-\w+-\w+)/);

  metrics.activateAdapters([{
    name: 'DataWarehouse',
    environments: ['development', 'production'],
    config: {
      host: wnycAccountRoot,
      endpoint: endpoint,
      debug: /debug/.test(window.location.search)
    }
  }, {
    name: 'GoogleAnalytics',
    config: {
      id
    },
    environments: ['development', 'production'],
  }]);

  // if (mailchimp !== null) {
  //   metrics.trackEvent('DataWarehouse', {
  //     eventName: 'trackMailChimpID',
  //     mailchimp: encodeURIComponent(mailchimp[1])
  //   });
  // }
}

export default {
  name: 'metrics',
  initialize
};
