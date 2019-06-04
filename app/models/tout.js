import BucketItemModel from 'nypr-publisher-lib/models/bucket-item';
import { get, computed } from '@ember/object';
import DS from 'ember-data';
const { attr } = DS;

export default BucketItemModel.extend({
    audio: attr(),
    body: attr('string'),
    imageMain: attr(),
    title: attr('string'),
    url: attr('string'),
    mainImageEligible: computed('template', 'imageMain', function(){
      let template = get(this, 'template');
      let imageWidth = get(this, 'imageMain.w');
      let imageDisplayFlag = get(this, 'imageMain.isDisplay');
      if (["story_video", "story_interactive", "story_noimage"].includes(template)) {
        return false;
      } else if (template === 'story_archives'){
        return true;
      } else if (imageWidth >= 800 && imageDisplayFlag === true){
        return true;
    }
  }),
});