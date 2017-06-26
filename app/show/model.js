import DS from 'ember-data';
import ChannelModel from 'wnyc-web-client/channel/model';

export default ChannelModel.extend({
  image: DS.belongsTo('image'),
  producingOrganizations: DS.hasMany('producing-organization')
});
