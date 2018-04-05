function reportFile() {
  if (_circleTestFolder()) {
    return _circleTestFolder() + '/test.xml';
  }
}

function testReporter() {
  return _circleTestFolder() ? 'xunit' : 'tap';
}

function _circleTestFolder() {
  return process.env['CIRCLE_TEST_REPORTS'];
}

module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: [
    'Chrome'
  ],
  launch_in_dev: [
    'Firefox',
    'Chrome'
  ],
  browser_args: {
    Chrome: {
      mode: 'ci',
      args: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.TRAVIS ? '--no-sandbox' : null,

        '--disable-gpu',
        '--headless',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  },
  reporter: testReporter(),
  report_file: reportFile(),
  xunit_intermediate_output: true
};
