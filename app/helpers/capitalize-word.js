import Ember from 'ember';
const { helper } = Ember.Helper

export default helper(function([ value ]){
    if ( value ) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
});
