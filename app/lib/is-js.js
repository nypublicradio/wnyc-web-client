export default function isJavascript(scriptTag) {
  let type = scriptTag.attributes.type ? scriptTag.attributes.type.value : 'text/javascript';
  return /(?:application|text)\/javascript/i.test(type);
}
