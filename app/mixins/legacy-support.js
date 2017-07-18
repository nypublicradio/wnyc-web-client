import Ember from 'ember';

const {
  Mixin,
  $
} = Ember;

const LEGACY_EVENT_SELECTORS = ['.js-listen', '.js-queue'];

function legacySelector(target) {
  return $(target).closest(LEGACY_EVENT_SELECTORS.join(','));
}

export default Mixin.create({
  isLegacyEvent(event) {
    return !!legacySelector(event.target).length;
  },
  fireLegacyEvent() {
  },
  revealStaffLinks($element, adminRoot) {
    $element.find('.stf').each(function() {
      var $elt, $this = $(this);
      if (this.tagName.toLowerCase() === 'a') {
        $elt = $this;
      } else {
        $this.append($elt = $("<a/>").addClass(this.className));
      }
      $elt.html($elt.html() || 'Edit This').attr("target", '_blank');
      $elt.attr("href", `${adminRoot}/admin/${$this.attr('data-url')}`);
      $this.show();
      $this.parent().show();
    });
  },
  actions: {
    listen(/*model, streamSlug*/) {
    },
    queue(/*model*/) {
    }
  }
});
