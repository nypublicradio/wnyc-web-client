import { helper as buildHelper } from '@ember/component/helper';

export function abbreviateTime(params/*, hash*/) {

  return params[0].replace(/seconds?/, 'sec').replace(/minutes?/, 'min').replace(/hours?/, 'hr');
}

export default buildHelper(abbreviateTime);
