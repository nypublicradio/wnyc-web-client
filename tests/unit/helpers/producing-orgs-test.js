import { producingOrgs } from 'wnyc-web-client/helpers/producing-orgs';
import { module, test } from 'qunit';

module('Unit | Helper | producing orgs');


const NPR = {
  name: "NPR", 
  url: "http://www.npr.org"
};
const WNYC = {
  name:"WNYC Studios",
  url:"http://wnycstudios.wnyc.org/"
};
const PRX = {
  name: "PRX", 
  url: "http://www.prx.org/"
};

test('it works', function(assert) {
  let theOrgs = [NPR];
  let result = producingOrgs([theOrgs], {unlinked:true});
  assert.ok(result);
});

test('uses "and" with two organizations', function(assert) {
  let theOrgs = [NPR,PRX];
  let result = producingOrgs([theOrgs], {unlinked:true});
  assert.ok(result);
  assert.equal(result.string.trim(), 'NPR and PRX', 'Producing orgs should render with "and"');
});

test('places a comma when three or more organizations', function(assert) {
  let theOrgs = [NPR,WNYC,PRX];
  let result = producingOrgs([theOrgs], {unlinked:true});
  assert.ok(result);
  assert.equal(result.string.trim(), 'NPR, WNYC Studios and PRX', 'Producing orgs should render with comma and "and"');
});

test('links items when unlinked is unspecified', function(assert) {
  let theOrgs = [NPR,WNYC,PRX];
  let result = producingOrgs([theOrgs]);
  assert.ok(result);

  let resultHTML = $.parseHTML("<div>" + result.string + "</div>");
  assert.equal($(resultHTML).find("a").length, 3, "there should be 3 links");
});