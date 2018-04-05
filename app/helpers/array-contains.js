import { helper as buildHelper } from '@ember/component/helper';
import { makeArray } from '@ember/array';

export function arrayContains(params/*, hash*/) {
  let a = makeArray(params[0]);
  return a.includes(params[1]);
}

export default buildHelper(arrayContains);
