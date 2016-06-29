import Component from 'ember-component';
import { or } from 'ember-computed';

export default Component.extend({
  classNames: ['persistent-backdrop'],
  image: null,
  fallbackImage: null,
  defaultImageUrl: '/assets/img/bg/player-background.png',
  backdropImageUrl: or('image', 'fallbackImage', 'defaultImageUrl')
});
