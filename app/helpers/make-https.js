import { helper } from '@ember/component/helper';

export function makeHttps([ string ]/*, hash*/) {
  if (!/^http:\/\//.test(string)) {
    return string;
  } else {
    return string.replace('http', 'https');
  }
}

export default helper(makeHttps);
