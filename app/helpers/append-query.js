import { helper } from '@ember/component/helper';

export function appendQuery([url = '', queryToAdd = '']/*, hash*/) {
  if (typeof url !== 'string' || typeof queryToAdd !== 'string') {
    return url;
  }

  // string any beginning ? characters
  queryToAdd = queryToAdd.replace(/^\?/, '');

  if (/\?$/.test(url)) {
    // incoming url ends with a ?, just jam on the query string
    return `${url}${queryToAdd}`;
  }

  // does a query string exist?
  let [, foundQuery, ...extra] = url.split('?');

  if (extra.length > 0) {
    // found a query string in the url or the query params
    // weird case, just bail out
    return url;
  }

  if (foundQuery) {
    // there's already a query string on the url, add it to the params
    return `${url}&${queryToAdd}`;
  } else {
    // no query string, make one
    return `${url}?${queryToAdd}`;
  }
}

export default helper(appendQuery);
