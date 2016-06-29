import Ember from 'ember';
import config from 'overhaul/config/environment';

export function chooseBetaPayload() {
  let beta;
  let retiredTrial = document.querySelector('#retired-beta');
  let activeTrial = document.querySelector('#active-beta');
  let myTrials = document.cookie.match(/wnyc_trial_\d+_interaction=(?:True|False)/g) || [];
  let inRetiredTrial = myTrials.contains(`wnyc_trial_${Ember.$(retiredTrial).attr('data-id')}_interaction=True`);
  if (!myTrials.length) {
    return activeTrial;
  }
  if (retiredTrial && inRetiredTrial) {
    beta = retiredTrial;
  }
  if (activeTrial && !inRetiredTrial) {
    beta = activeTrial;
  }
  return beta;
}

export function initialize(appInstance) {
  const { betaTrials: { isBetaSite, preBeta } } = config;
  let betaPayload = chooseBetaPayload();

  if (betaPayload) {
    let beta = Ember.Object.create();
    try {
      let { attributes, id } = JSON.parse(betaPayload.textContent);
      beta.setProperties(attributes);
      beta.set('id', id);
    } catch(e) {
      beta.set('error', e.message);
    }
    beta.set('isBetaSite', isBetaSite);
    beta.set('preBeta', preBeta);
    appInstance.register('beta:main', beta, {instantiate: false});
    appInstance.inject('component:django-page', 'beta', 'beta:main');
    appInstance.inject('controller:application', 'beta', 'beta:main');
  }
}

export default {
  name: 'beta-trial',
  initialize
};
