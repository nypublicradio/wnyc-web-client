import { isAnimating, finish, timeSpent, animate, stop } from "liquid-fire";

export default function() {
  let explode = this.lookup('explode');
  return explode.call(this, {
    pick: '.tab-line--liquid',
    use: ['fly-to', { duration: 250 }]
  }).then(() => {
    this.newView.$('.list').scrollLeft(this.newView.$('.is-active').position().left)
    return Promise.resolve();
    //return animate(this.newElement.find('.is-active'), 'scroll', {
    //  axis: 'x',
    //  container: this.newView.$('.list'),
    //}).then(() => {
    //  debugger;
    //});
  });
}
