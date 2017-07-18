import resolver from './helpers/resolver';
import './helpers/flash-message';

import './helpers/responsive';

import {
  setResolver
} from 'ember-qunit';
import { start } from 'ember-cli-qunit';

setResolver(resolver);
start();
