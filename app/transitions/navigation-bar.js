import { animate } from "liquid-fire";

export default function() {
  let explode = this.lookup('explode');
  let oldNavLeft;
  if (this.oldElement) {
    oldNavLeft = this.oldElement.find('ul')[0].scrollLeft;
  }
  this.newElement.find('ul')[0].scrollLeft = oldNavLeft || 0;

  return explode.call(this, {
    pick: '.tab-line--liquid',
    use: ['fly-to', { duration: 250 }]
  }).then(() => {
    if (this.oldElement) {
      this.oldElement.hide();
    }
    return animate(this.newElement.find('.is-active'), 'scroll', {
      axis: 'x',
      container: this.newView.$('.list'),
    });
  });
}
