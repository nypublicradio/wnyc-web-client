/*jshint node:true*/
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
<<<<<<< HEAD
  launch_in_dev: [
    'Firefox',
    'Chrome'
  ],
  browser_args: {
    Chrome: [
      '--disable-gpu',
      '--headless',
      '--remote-debugging-port=9222',
      '--window-size=1440,900'
    ]
  },
  "launch_in_dev": [
    "Chrome",
    "Firefox"
  ],
  "reporter": testReporter(),
  "report_file": reportFile(),
  "xunit_intermediate_output": true
};
