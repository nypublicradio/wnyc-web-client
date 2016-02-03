import Ember from 'ember';
const {
    Helper
} = Ember;


export function podcastIcons(item) {
    let podcast = item[0];
    let podcastString = '';
    if(podcast.title.toLowerCase() === 'rss') {
     podcastString = `<i class="fa fa-rss"></i>${podcast.title}`;
    } else {
     podcastString = `<i class="fa fa-mobile"></i>${podcast.title}`;
    }
   return Ember.String.htmlSafe(podcastString);
}

export default Helper.helper(podcastIcons);


