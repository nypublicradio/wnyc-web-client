import Ember from 'ember';

const {
    typeOf
} = Ember;

export function filterForNewsLetter(value/*, index*/) {
    const title = value.title.toLowerCase();
    if (title === 'newsletter') {
        return true;
    } else {
        return false;
    }
}

export function getNewsLetter(value) {
    return value.title.toLowerCase() === 'newsletter';
}

export function filterOutTitleByDonate(value/*, index*/) {
      return value.title !== 'Donate';
}

export function filterForSocialIcons(value/*, index*/) {
    const title = value.title.toLowerCase();
    if(title !== 'donate' && title !== 'newsletter') {
        return true;
    } else {
        return false;
    }
}

export function checkPropertyExists(prop) {
    if(typeOf(prop) !== 'undefined' && (typeOf(prop) !== 'null')) {
        return true;
    } else {
        return false;
    }
}

export function filterForByTitle(collection, value) {
  let item = collection.find(i => i.title.toLowerCase() === value);
  if (!item) {
    return '';
  }
  item.iconClassName = item.title.toLowerCase();
  return item;
}
