import resolver from './helpers/resolver';
import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start, setResolver } from 'ember-qunit';
import './helpers/flash-message';
import loadEmberExam from 'ember-exam/test-support/load';

setApplication(Application.create(config.APP));

loadEmberExam();

setResolver(resolver);
start();
