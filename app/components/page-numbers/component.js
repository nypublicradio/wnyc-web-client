import Component from'ember-component';
import computed, { gt, equal } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  
  hasPages: gt('totalPages', 0),
  hasOnePage: equal('totalPages', 1),
  pagesToShow: 10,
  pageSize: 10,
  
  bounds: computed('centerPage', 'pagesToShow', 'totalPages', function() {
    let pagesToShow = get(this, 'pagesToShow');
    let totalPages = get(this, 'totalPages');
    let range = Math.floor(pagesToShow / 2);
    
    if (totalPages < pagesToShow) {
      return {
        lower: 1,
        upper: totalPages,
        range
      };
    } else {
      let centerPage = get(this, 'centerPage');
      let pagesToShowIsEven = pagesToShow % 2 === 0;
      
      return {
        lower: centerPage - (pagesToShowIsEven ? range - 1 : range),
        upper: centerPage + range,
        range
      };
    }
  }),
  
  centerPage: computed('currentPage', 'pageToShow', function() {
    let currentPage = get(this, 'currentPage');
    let pagesToShow = get(this, 'pagesToShow');
    
    let minCenterPage = Math.ceil(pagesToShow / 2);
    return (currentPage >= minCenterPage) ? currentPage : minCenterPage;
  }),
  
  onFirstPage: equal('currentPage', 1),
  
  onLastPage: computed('currentPage', 'totalPages', 'hasOnePage', function() {
    return get(this, 'currentPage') === get(this, 'totalPages') || get(this, 'hasOnePage');
  }),
  
  pages: computed('bounds', 'totalPages', 'pagesToShow', 'centerPage', function() {
    let bounds = get(this, 'bounds');
    let totalPages = get(this, 'totalPages');
    let currentPage = get(this, 'currentPage');
    let centerPage = get(this, 'centerPage');
    
    let pages = [];
    for (let i = bounds.lower; i <= bounds.upper; i++) {
      pages.push({
        page: i,
        current: i === currentPage
      });
    }
    
    if (bounds.lower !== 1) {
      pages.unshift({
        page: 1,
        dots: centerPage > bounds.range + 1
      });
    }
    if (bounds.upper !== totalPages) {
      pages.push({
        page: totalPages,
        dots: centerPage < (totalPages - bounds.range)
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
