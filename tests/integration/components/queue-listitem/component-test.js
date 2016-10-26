import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

moduleForComponent('queue-listitem', 'Integration | Component | queue listitem', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{queue-listitem}}`);

  assert.equal(this.$('.queueitem').length, 1);
});

test('it displays the correct metadata', function(assert) {
  this.set('story', {
    headers: {brand: {title: 'Show Title', url: '/'}},
    title: 'Story Title',
    audioDurationReadable: '3 min'
  });
  this.render(hbs`{{queue-listitem story=story}}`);

  assert.equal(this.$('.queueitem-itemtitle').text().trim(), 'Story Title');
  assert.equal(this.$('.queueitem-showtitle').text().trim(), 'Show Title');
  assert.equal(this.$('.queueitem-duration').text().trim(), '3 min');
});

test('it calls the removeAction with the story id', function(assert) {
  let remove = sinon.spy();
  this.set('story', {id: 5});
  this.set('removeAction', remove);
  this.render(hbs`{{queue-listitem story=story removeAction=removeAction}}`);

  this.$('.queueitem-deletebutton').click();

  assert.ok(remove.calledOnce);
  assert.ok(remove.calledWith(5));
});

test('it renders html in metadata', function(assert) {
  this.set('story', {
    headers: {brand: {title: 'The <em>New</em> Show', url: '/'}},
    title: 'The <strong>Big</strong> Story',
  });
  this.render(hbs`{{queue-listitem story=story}}`);

  assert.equal(this.$('.queueitem-itemtitle').text().trim(), 'The Big Story');
  assert.equal(this.$('.queueitem-showtitle').text().trim(), 'The New Show');
  assert.equal(this.$('.queueitem-itemtitle strong').length, 1);
  assert.equal(this.$('.queueitem-showtitle em').length, 1);
});

test('it shows the now playing if it is the current item when playing from queue', function(assert) {
  this.set('playContext', 'queue');
  this.render(hbs`{{queue-listitem playContext=playContext isCurrent=true}}`);

  assert.equal(this.$('.queueitem-playingicon').length, 1);
});

