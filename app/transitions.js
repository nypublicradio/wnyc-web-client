import config from '../overhaul/config/environment';

function duration(time) {
  return (config.environment === 'test' ? 0 : time);
}

export default function() {
  this.setDefault({duration: duration(250)});
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

  this.transition(
    this.toRoute('discover.index'),
    this.use('scrollThen', 'toRightWithReset', {easing: 'ease-in-out', duration: duration(100)})
  );

  this.transition(
    this.fromRoute('discover.index'),
    this.toRoute(['discover.edit', 'discover.edit.topics']),
    this.use('toLeftWithReset', {easing: 'ease-in-out', duration: duration(100)})
  );

  this.transition(
    this.fromRoute('discover.start'),
    this.use('discoverStart')
  );

  this.transition(
    this.includingInitialRender(),
    this.fromRoute(null),
    this.toRoute('discover.start'),
    this.use('discoverStart')
  );

  this.transition(
    this.fromRoute('discover.topics'),
    this.toRoute('discover.start'),
    this.use('scrollThen', 'discoverStart', {easing: 'ease-in-out', duration: duration(100)})
  );

  this.transition(
    this.toRoute('discover.index_loading'),
    this.use('discoverLoading')
  );

  this.transition(
    this.fromRoute('discover.shows'),
    this.toRoute('discover.index_loading'),
    this.use('discoverLoading', {direction: 'fromLeft'})
  );

  this.transition(
    this.fromRoute('discover.index_loading'),
    this.use('discoverLoading')
  );
}
