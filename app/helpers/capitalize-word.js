import { helper } from '@ember/component/helper';

export default helper(function([ value ]){
    if ( value ) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
});
