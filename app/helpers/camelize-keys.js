import { helper as buildHelper } from '@ember/component/helper';

export function camelizeKeys([ source ]/*, hash*/) {
  let dest = {};
  Object.keys(source).forEach(k => dest[k.camelize()] = source[k]);
  return dest;
}

export default buildHelper(camelizeKeys);
