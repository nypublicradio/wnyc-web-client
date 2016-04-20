import Ember from 'ember';

const {
  Mixin,
  inject,
  get,
  $
} = Ember;

const LEGACY_EVENT_SELECTORS = ['.js-listen', '.js-queue'];

function legacySelector(target) {
  return $(target).closest(LEGACY_EVENT_SELECTORS.join(','));
}

export default Mixin.create({
  legacyServices: inject.service(),

  isLegacyEvent(event) {
    return !!legacySelector(event.target).length;
  },
  fireLegacyEvent(target) {
    let legacy = get(this, 'legacyServices');
    let legacyTarget = legacySelector(target);
    let { itemPK, itemTitle } = legacyTarget.data('ember-args');
    if (legacyTarget.hasClass('js-listen')) {
      return legacy.listen(itemPK, itemTitle);
    }
    if (legacyTarget.hasClass('js-queue')) {
      return legacy.queue(itemPK);
    }
  },
  actions: {
    listen(model, streamSlug) {
      const id = get(model, 'id');
      const title = get(model, 'title');
      const show = get(model, 'headers.brand.title');
      const legacy = get(this, 'legacyServices');

      if (streamSlug) {
        legacy.streamStation(streamSlug);
      } else {
        legacy.listen(id, title, show);
      }
    },
    queue(model) {
      const id = get(model, 'id');
      const legacy = get(this, 'legacyServices');

      legacy.queue(id);
    }
  }
});
