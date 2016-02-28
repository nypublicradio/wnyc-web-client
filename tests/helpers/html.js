export function appendHTML(string) {
  $(string.trim()).appendTo('#ember-testing');
}

export function resetHTML() {
  $('#ember-testing').empty();
}
