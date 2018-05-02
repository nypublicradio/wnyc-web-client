import {
  create,
  visitable,
  clickable,
  collection,
  text,
  isVisible
} from 'ember-cli-page-object';

export default create({
  visit:             visitable('/?modal=queue-history'),
  clickHistoryTab:   clickable('.tabbedlist-button:contains(My Listening History)'),
  clickClearHistory: clickable('.clearhistory-main .clearhistory-button'),
  clickYes:          clickable('.clearhistory-button:contains(Yes)'),
  clickNo:           clickable('.clearhistory-button:contains(No)'),
  historyIsVisible:  isVisible('.player-history'),
  clearPromptIsVisible:  isVisible('.clearhistory-prompt'),
  emptyMessageIsVisible: isVisible('.queuelist-empty'),
  stories: collection('.player-history .list-item', {
    title:       text('.queueitem-itemtitle'),
    clickDelete: clickable('.queueitem-deletebutton'),
  })
});
