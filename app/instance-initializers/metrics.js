import ENV from 'wnyc-web-client/config/environment';

const {
  googleAnalyticsKey,
  nprGoogleAnalyticsKey,
  wnycAccountRoot
} = ENV;

export function initialize(applicationInstance) {
  const metrics = applicationInstance.lookup('service:metrics');
  const endpoint = 'api/v1/analytics/ga';
  //const mailchimp = String(window.location).match(/utm_term=(\d+_\w+-\w+-\w+)/);

  metrics.activateAdapters([{
    name: 'DataWarehouse',
    config: {
      host: wnycAccountRoot,
      endpoint: endpoint,
      debug: /debug/.test(window.location.search)
    }
  }, {
    name: 'GoogleAnalytics',
    config: {
      id: googleAnalyticsKey
    },
  }, {
    name: 'NprAnalytics',
    config: {
      id: nprGoogleAnalyticsKey
    }
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
