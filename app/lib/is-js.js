export default function isJavascript(scriptTag) {
  // TODO: add a console warning if the script tag doesn't have an attribute? 
  // seems like it's required for some parts of ember consumption
  let type = scriptTag.attributes.type ? scriptTag.attributes.type.value : 'text/javascript';
  // guard against chrome-extension:// scripts
  let badSrc = scriptTag.src && !scriptTag.src.match(/^http|^\//);

  return !badSrc && /(?:application|text)\/(deferred-)?javascript/i.test(type);
}
