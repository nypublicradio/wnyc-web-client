/*
   The main goal here is parallel loading with sequential
   evaluation. We want to fetch all the scripts in parallel for the
   fastest experience, but we need to evaluate them in their original
   order in case they depend on each other.
*/

const supportsAsync = 'async' in document.createElement('script');
const supportsReadyState = !!document.createElement('script').readyState;

export default function loadScripts(scriptTags, containerElement) {
  let pendingScripts = [];

  function stateChange() {
    var pendingScript;
    while (pendingScripts[0] && pendingScripts[0].readyState === 'loaded') {
      pendingScript = pendingScripts.shift();
      pendingScript.onreadystatechange = null;
      containerElement.appendChild(pendingScript);
    }
  }

  Array.from(scriptTags).forEach(tag => {
    let script = document.createElement('script');
    let useStateChange = false;

    if (supportsAsync) { // modern browsers
      script.async = false;
    } else if (supportsReadyState) {  // IE<10
      pendingScripts.push(script);
      script.onreadystatechange = stateChange;
      useStateChange = true;
    } else {  // old non-IE
      script.defer = false;
    }

    if (tag.attributes.src) {
      script.src = tag.attributes.src.value;
    } else {
      script.textContent = tag.textContent;
    }

    if (!useStateChange) {
      containerElement.appendChild(script);
    }
  });
}
