import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id) {
    return {
      data: {
        id,
        type: 'current-user',
        attributes: {
          username: payload.username,
          isStaff: payload.is_staff,
          name: payload.name,
          adminUrl: payload.adminURL,
          email: payload.email,
          isAuthenticated: payload.isAuthenticated,
          attributes: payload.attributes,
          avatars: payload.avatars
        }
      }
    }
  }

});
