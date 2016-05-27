import { isAnimating, finish, timeSpent, animate, stop, Promise } from "liquid-fire";

export default function() {
  let explode = this.lookup('explode');
  return explode.call(this, {
    pick: '.tab-line--liquid',
    use: ['fly-to', { duration: 250 }]
  }).then(() => {
    return animate(this.newElement.find('.is-active'), 'scroll', {
      axis: 'x',
      container: this.newView.$('.list'),
    });
  });
}
