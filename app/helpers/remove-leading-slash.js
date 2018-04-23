import { helper as buildHelper } from '@ember/component/helper';

export function removeLeadingSlash([ string ] /*, hash */) {
  if (string.startsWith('/')){
    string = string.slice(1);
  }
  return string;
}

export default buildHelper(removeLeadingSlash);
