import config from 'overhaul/config/environment';
import Ember from 'ember';

// The Alien DOM is a DOM that exists beyond the reaches of an Ember app's
// understanding, i.e. an HTML document that is already present when the app boots.

// This is assigned to in installAlienListeners so it can later be referenced for
// removal from the click event.
let alienClickListener;

// When we are operating in progressive boot mode, Ember can detect if a requested
// django-page model is already present by testing the requested id (the url path)
// against a marker provided by django.
export function isInDom(id) {
  let unrenderedMarker = document.querySelector('[type="text/x-wnyc-marker"]');
  return unrenderedMarker && id === unrenderedMarker.getAttribute('data-url');
}

// When we have a django-page model ready to load, we need to clean out any remnants
// of an Alien DOM. This will run on every django-page render, but should be a simple
// no-op after one run.
export function clearAlienDom() {
  let root = config.environment === 'test' ? '#ember-testing' : 'body';
  let notEmber = document.querySelectorAll(`${root} > :not(.ember-view), ${root} > head > link[rel=stylesheet]:not([href*=assets])`);
  
  Array.from(notEmber).forEach((n) => {
    n.parentNode.removeChild(n);
  });

  removeAlienListeners();
}

export function unbindAlienListener() {
  document.removeEventListener('click', alienClickListener);
}

export function removeAlienListeners() {
  Ember.$(document)
    .off('click',  '.js-accordionButton')
    .off('click',  '.js-dropdownClickable')
    .off('click',  '.js-captionBtn')
    .off('click',  '.js-listen')
    .off('click',  '.js-queue')
    .off('click',  '.js-share')
    .off('submit', '#morningBriefSignup')
    .off('keyup',  '#morningBriefEmailInput')
    .off('click', '.js-toggleButton');

  Ember.$('.js-embedText').off('click');
}


// Embedded Ember components require an ID for ember-wormwhole to use them as a
// destination. This runs in the django-page model's separateScripts method as well
// as in the django-page component's didReceiveAttrs hook if an Alien DOM is present.
export function embeddedComponentSetup(root = document) {
  Array.from(root.querySelectorAll('[data-ember-component]')).forEach(function (el, i) {
    // embedded ember components require an ID that is in sync with the
    // django-page document
    el.id = el.id || `ember-component-${i}`;
  });
}

// An Alien DOM means legacy events will escape Ember, so the django-page component also
// installs these handlers to capture clicks and other events and send them back to Ember.
// We have to use a closure in order to both capture the passed in component instance as
// well as save the function for later removal from the global click event.
export function installAlienListeners(component) {
  alienClickListener = function(e) {
    component.click(e);
  };

  document.addEventListener('click', alienClickListener, false);

  imagesLoaded(document.body).on('progress', (i, image) => {
    Ember.run(() => {
      image.img.classList.add('is-loaded');
    });
  });
}

export function addAlienLanding(id, coordinates) {
  let landingSite = document.querySelector(coordinates);
  let lander = document.createElement('div');
  lander.id = id;
  try {
    if (Ember.testing) {
      landingSite.appendChild(lander);
    } else {
      landingSite.parentNode.insertBefore(lander, landingSite);
    }
  } catch(e) {
    return false;
  }
}

// this method could be a one line, but in testing it would open a new window,
// so let's us override in testing with a method of our own, located at 
// `window.assign`.
export function assign(url) {
  if (Ember.testing) {
    window.assign(url);
  } else {
    window.location.assign(url);
  }
}
