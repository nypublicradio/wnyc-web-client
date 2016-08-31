import Component from'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  
  hasPages: computed.gt('totalPages', 0),
  
  pageItems: computed('currentPage', 'totalPages', function() {
    let currentPage = get(this, 'currentPage');
    let totalPages = get(this, 'totalPages');
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push({
        dots: i > 10,
        page: i,
        current: i === currentPage
      });
    }
    return pages;
  }),

  currentPageClass: computed('currentPage', function(){
    let currentPage = get(this, 'currentPage');

    if(Number(currentPage) === 1) {
      return 'page-one';
    } else {
      return 'pagination';
    }
  }),
  
  canStepForward: computed('currentPage', 'totalPages', function() {
    let page = Number(get(this, 'currentPage'));
    let totalPages = Number(get(this, 'totalPages'));
    return page < totalPages;
  }),
  
  canStepBackward: computed('currentPage', 'totalPages', function() {
    let page = Number(get(this, 'currentPage'));
    return page > 1;
  }),
  
  actions: {
    pageClicked(num) {
      set(this, 'currentPage', num);
      this.sendAction('action', num);
    },
    incrementPage(num) {
      let currentPage = get(this, 'currentPage');
      let totalPages = get(this, 'totalPages');
      
      if (currentPage === totalPages && num === 1) { return false; }
      if (currentPage <= 1 && num === -1) { return false; }
      this.incrementProperty('currentPage', num);
      let newPage = this.get('currentPage');
      this.sendAction('action', newPage);
    }
  }
});
