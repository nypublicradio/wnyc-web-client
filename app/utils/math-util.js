export function totalPages(totalItems, offset = 10) {
    const value = totalItems / offset;
    const pages = Math.ceil(value);

    return isNaN(pages) ? 0 : pages;
}

export function calculateOffset(page, limitPerPage) {
    const offset = (page - 1) * limitPerPage;
    return offset;
}

export function firstLessThan(ary, num) {
    for (let i = 0; i < ary.length; i++) {
      if (num < ary[i]) {
        return String(ary[i]);
      }
    }
    return ("greater than " + ary[ary.length-1]);
  }
