import {
  create,
  visitable,
  clickable,
  collection,
  text,
  isVisible
} from 'ember-cli-page-object';

export default create({
  visit:             visitable('/fake?modal=queue-history'),
  clickHistoryTab:   clickable('.tabbedlist-button:contains(History)'),
  clickClearHistory: clickable('.clearhistory-button:contains(Clear)'),
  clickYes:          clickable('.clearhistory-button:contains(Yes)'),
  clickNo:           clickable('.clearhistory-button:contains(No)'),
  historyIsVisible:  isVisible('.player-history'),
  clearPromptIsVisible:  isVisible('.clearhistory-prompt'),
  emptyMessageIsVisible: isVisible('.queuelist-empty'),
  stories: collection({
    itemScope: '.player-history .list-item',
    item: {
      title:               text('.queueitem-itemtitle'),
      clickDelete:         clickable('.queueitem-deletebutton'),
    }
  })
});
