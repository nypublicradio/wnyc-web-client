import { helper as buildHelper } from '@ember/component/helper';

export function slice([list, start, end]/*, hash*/) {
  return Array.from(list).slice(start, end);
}

export default buildHelper(slice);