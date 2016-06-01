import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('show-tease', 'Integration | Component | show tease', {
  integration: true
});

test('it renders', function(assert) {

  const testShow = {
    'title': 'All Things Considered',
    'tease': "A wrap-up of the day's news, with features and interviews.",
    "logoImage": {
      "creditsUrl": "",
      "name": "1/2DQ_1400X1400_NoWNYCSTUDIOS_2.png",
      "source": null,
      "url": "http://www.wnyc.org/i/1400/1400/l/80/1/2DQ_1400X1400_NoWNYCSTUDIOS_2.png",
      "h": 1400,
      "isDisplay": true,
      "crop": "l",
      "caption": "",
      "template": "http://www.wnyc.org/i/%s/%s/%s/%s/1/2DQ_1400X1400_NoWNYCSTUDIOS_2.png",
      "w": 1400,
      "id": 151040,
      "creditsName": "WNYC Studios"
    },
    'producingOrganizations': [
      {'name': 'WNYC', 'url': 'http://www.wnyc.org'},
      {'name': 'NPR', 'url': 'http://www.npr.org'}
    ]
  };

  this.set("testShow", testShow);
  this.set("featured", false);

  this.render(hbs`{{show-tease show=testShow featuredSpot=featured}}`);
  
  assert.equal(this.$(".flag").hasClass("flag--med"), true, "Regular Show Tease has class flag-med");
  assert.equal(this.$('.flag-body .text h4').text().trim(), 'WNYC and NPR', 'Producing orgs should render');
  assert.equal(this.$('.flag-body .text h4 a').length, 0, 'Producing orgs should not have links');
  assert.equal(this.$('.flag-body .text h2').text().trim(), 'All Things Considered', 'Title should render correctly');
  assert.equal(this.$('.flag-body .text .text-body--nopad').text().trim(), "A wrap-up of the day's news, with features and interviews.", 'Description should render correctly');
  assert.equal(this.$('.flag-image img').attr("src"), "http://www.wnyc.org/i/135/135/l/99/1/2DQ_1400X1400_NoWNYCSTUDIOS_2.png", "Image is populated");


  // check for edits when it is a featured item
  this.set("featured", true);

  assert.equal(this.$(".flag").hasClass("flag--luxe"), true, "Featured Spot has class flag-luxe");
  assert.equal(this.$('.flag-body .text h4.text--lightgray').text().trim(), 'WNYC and NPR', 'Producing orgs should render');
  assert.equal(this.$('.flag-body .text h4 a').length, 0, 'Producing orgs should not have links');
  assert.equal(this.$('.flag-body .text h2').text().trim(), 'All Things Considered', 'Title should render correctly');
  assert.equal(this.$('.flag-body .text .h3').text().trim(), "A wrap-up of the day's news, with features and interviews.", 'Description should render correctly');
  assert.equal(this.$('.flag-image img').attr("src"), "http://www.wnyc.org/i/250/250/l/99/1/2DQ_1400X1400_NoWNYCSTUDIOS_2.png", "Image is populated");


});
