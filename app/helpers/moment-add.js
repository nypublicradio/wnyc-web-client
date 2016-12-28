import helper from 'ember-helper';
import moment from 'moment';

export function momentAdd(params) {
  const [dateAsMoment, addValue, addUnit, outputFormat] = params;
  const newMoment = moment(dateAsMoment).clone().add(addValue, addUnit).format(outputFormat);
  return newMoment;
}

export default helper.helper(momentAdd);
