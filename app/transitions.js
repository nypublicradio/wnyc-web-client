import config from '../wqxr-web-client/config/environment';

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
    this.hasClass('nypr-player-wrapper'),
    this.use('playerReveal')
  );
  this.transition(
    this.hasClass('player-notification-wrapper'),
    this.use('notificationReveal')
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
    this.hasClass('toggle-container'),
    this.use('slideToggle')
  );
  this.transition(
    this.includingInitialRender(),
    this.hasClass('sliding-modal'),
    this.use('slidingModal')
  );
}
