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
  revealStaffLinks(session) {
    let userData = session.get('data.authenticated');
    if (!get(userData, 'is_staff')) {
      return;
    }
    $('.stf').each(function() {
      var $elt, $this = $(this);
      if (this.tagName.toLowerCase() === 'a') {
        $elt = $this;
      } else {
        $this.append($elt = $("<a/>").addClass(this.className));
      }
      $elt.html($elt.html() || 'Edit This').attr("target", '_blank');
      $elt.attr("href", `${get(userData, 'adminUrl')}/${$this.attr('data-url')}`);
      $this.show();
      $this.parent().show();
    });
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
