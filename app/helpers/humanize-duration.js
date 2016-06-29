import Ember from 'ember';
const {
  helper
} = Ember.Helper;

export default helper(function(seconds) {
  if (seconds < 60) {
    seconds = 60;
  }
  let durations = [];
  let minutes = Math.floor(seconds/ 60);
  let hours = Math.floor(seconds/ 3600);
  if (hours > 0){
    durations.push(`${hours} h`);
  }
  if (minutes){
    durations.push(`${minutes} min`);
  }
  return durations.join(' ');
});
