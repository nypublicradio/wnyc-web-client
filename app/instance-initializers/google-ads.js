let leaderboard;
  
const googletag = window.googletag = window.googletag || {};
googletag.cmd  = window.googletag.cmd || [];

function refresh(/* mql */) {
  googletag.pubads().refresh([leaderboard]);
}

export function initialize({ application }) {
  if (application.testing) {
    googletag.apiReady = true;
  } else {
    let gads = document.createElement('script');
    gads.async = true; gads.type = 'text/javascript';
    gads.src = 'https://www.googletagservices.com/tag/js/gpt.js';
    let node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
  }
  
  googletag.cmd.push(function() {
    let leaderboard_mapping = googletag.sizeMapping()
      .addSize([0, 0], [300, 50])
      .addSize([758, 0], [728, 90])
      .addSize([1203, 0], [970, 415])
      .build();
      
    leaderboard = googletag.defineSlot('/6483581/leaderboard/wnyc_leaderboarddemo', [[728, 90], [970, 415], [300, 50]], 'leaderboard')
      .defineSizeMapping(leaderboard_mapping)
      .addService(googletag.pubads());
      
    window.matchMedia('(min-width: 758px)').addListener(refresh);
    window.matchMedia('(min-width: 1203px)').addListener(refresh);
    
    googletag.defineSlot("/6483581/rectangle/wnyc_rectangle", [[300, 250], [300, 600]], "home_bigbox_ad").addService(googletag.pubads());
    googletag.defineSlot("/6483581/rectangle/wnyc_rectangle2", [[300, 250], [300, 600]], "home_bigbox2_ad").addService(googletag.pubads());
    googletag.defineSlot("/1007549/home_smallbox", [210, 350], "home_smallbox_ad").addService(googletag.pubads());
    googletag.defineSlot("/1007549/home_smallbox2", [210, 350], "home_smallbox2_ad").addService(googletag.pubads());
    googletag.defineSlot("/6483581/rectangle/wnyc_rectangle", [[300, 250], [300, 600]], "rightRail").addService(googletag.pubads());

    googletag.pubads().enableSingleRequest();
    googletag.pubads().collapseEmptyDivs();
    googletag.enableServices();
  });
}

export default {
  name: 'google-ad',
  initialize
};
