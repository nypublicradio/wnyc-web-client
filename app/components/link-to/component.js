import LinkComponent from '@ember/routing/link-component';

export default LinkComponent.extend({
  attributeBindings: ['data-action', 'data-label']
});
