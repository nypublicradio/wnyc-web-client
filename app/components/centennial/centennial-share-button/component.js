import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments)
    this.set('mailtoUrl', `mailto:?subject=${this.shareTitle}&body=${this.shareTitle}%0A%0A${this.shareUrl}`)
  },
  actions: {
    shareX() {
      window.open(`https://x.com/intent/tweet?text=${this.shareTitle}&url=${this.shareUrl}`, 'twitter-share-dialog', 'width=626,height=436');
    },
    shareFacebook() {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl}`, 'facebook-share-dialog', 'width=626,height=436');
    },
    updateClipboard() {
      navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
          navigator.clipboard.writeText(this.shareUrl)
        }
      })
    }
  }
});
