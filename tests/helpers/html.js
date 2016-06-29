export function appendHTML(string) {
  $(string.trim()).appendTo('#ember-testing');
}

export function resetHTML() {
  $('#ember-testing').empty();
  $('#ember-testing-container > :not(#ember-testing)').remove();
}

export function appendIfNot(id) {
  let node = document.getElementById(id);

  if (!node) {
    node = document.createElement('div');
    node.id = id;
    $('#ember-testing').append(node);
  }
}
