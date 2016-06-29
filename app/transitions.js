export default function() {
  this.transition(
    this.childOf('.player-history'),
    this.use('explode', {
      matchBy: 'data-id',
      use: ['fly-to', {duration: 250}]
    })
  );
  this.transition(
    this.childOf('.player-queue'),
    this.use('explode', {
      matchBy: 'data-id',
      use: ['fly-to', {duration: 250, movingSide: 'new'}]
    })
  );
  this.transition(
    this.hasClass('player-wrapper'),
    this.use('playerReveal')
  );
  this.transition(
    this.includingInitialRender(),
    this.childOf('.tabs-header'),
    this.use('navigationBar')
  );
  this.transition(
    this.childOf('.tabbedlist > ul'),
    this.use('explode', {
      pick: '.tabbedlist-marker',
      use: ['fly-to', { duration: 250 }]
    })
  );
  this.transition(
    this.includingInitialRender(),
    this.toValue((newVal, oldVal) => newVal === 'queue-history' || oldVal === 'queue-history'),
    this.use('slidingModal')
  );
}
