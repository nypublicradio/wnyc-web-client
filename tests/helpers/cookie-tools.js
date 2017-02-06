export function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function readCookies() {
  let cookies = {};
  document.cookie.split(';').forEach(function(cookie) {
    let key = cookie.split('=')[0].replace(/^ +/, "");
    let value = cookie.split('=')[1];
    cookies[key] = value;
  });
  return cookies;
}

export function clearCookies() {
  Object.keys(readCookies()).forEach(function(key) {
    deleteCookie(key);
  });
}
