// TODO: using wnyc.listen module for session data for now
// function initialize(applicationInstance) {
//   const sessionManager = applicationInstance.container.lookup('service:session-manager');
//   const knownIdentities = sessionManager.get('knownIdentities');
//   const {
//     login_root,
//     etag_server
//   } = window.wnyc;

//   knownIdentities.pushObjects([{
//     name: 'user',
//     endpoint: `${login_root}/api/v1/is_logged_in/`
//   }, {
//     name: 'browser',
//     endpoint: etag_server
//   }]);
// }

export default {
  name: 'sessionManager',
  initialize() {}
};
