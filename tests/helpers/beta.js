import Ember from 'ember';
import moment from 'moment';

export function clearBetaCookies() {
  document.cookie = `wnyc_trial_1_interaction=; expires=${new Date(0)};`;
}

export function generateBetaTrial(withExit) {
  let beta = Ember.Object.create({
    status: 'active',
    tease: 'beta tease',
    welcome_message: 'beta welcome',
    feedback_form: 'feedback.com',
    exit_message: 'beta exit',
    name: 'beta name',
    slug: 'beta-slug',
    retired_at: null,
    site_id: 1,
    started_at: moment().format()
  });

  if (withExit) {
    beta.set('status', 'retired');
    document.cookie = 'wnyc_trial_1_interaction=True';
  }

  return beta;
}

export function plantBetaTrial(withExit) {
  clearBetaCookies();
  let attributes = generateBetaTrial(withExit);
  let json = {attributes, id: 1, type: 'trial'};
  let el = document.createElement('script');
  el.type = 'application/json';
  el.id = withExit ? 'retired-beta' : 'active-beta';
  el.setAttribute('data-id', 1);
  el.textContent = JSON.stringify(json);

  document.querySelector('#ember-testing').appendChild(el);

  return el;
}
