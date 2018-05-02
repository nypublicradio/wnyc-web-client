import { helper as buildHelper } from '@ember/component/helper';

export function decamelizeKeys([ source ]/*, hash*/) {
  let dest = {};
  Object.keys(source).forEach(k => dest[k.decamelize()] = source[k]);
  return dest;
}

export default buildHelper(decamelizeKeys);
