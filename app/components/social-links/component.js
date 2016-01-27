import Ember from 'ember';

const {
    Component,
    computed,
} = Ember;

export default Component.extend({
    facebook: computed.readOnly('model.facebook'),
    twitter: computed.readOnly('model.twitter') ,
    newsletter: computed.readOnly('model.newsletter'),

    facebookClassName: 'fa fa-facebook',
    twitterClassName: 'fa fa-twitter'
    
});
