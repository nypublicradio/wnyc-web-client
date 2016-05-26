export default function() {
  this.transition(
    this.childOf('.tabs-header > ul'),
    this.use('explode', {
      pick: '.tab-line--liquid',
      use: ['fly-to', { duration: 250 }]
    })
  );
}
