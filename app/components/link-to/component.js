import LinkComponent from '@ember/routing/link-component';

export default LinkComponent.extend({
  attributeBindings: ['data-category', 'data-action', 'data-label', 'data-value']
});
