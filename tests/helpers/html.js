export function appendHTML(string) {
  $(string.trim()).appendTo('#ember-testing');
}

export function resetHTML() {
  $('#ember-testing').empty();
}

export function alienDOMMarker(id) {
  return `<script type="text/x-wnyc-marker" data-url="${id}"></script>`;
}
