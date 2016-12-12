import Controller from 'ember-controller';

export default Controller.extend({
  isEditing: false,
  
  actions: {
    edit() {
      this.set('isEditing', true);
    }
  }
});
