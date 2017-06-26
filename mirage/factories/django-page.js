import { Factory } from 'ember-cli-mirage';
import serialize from 'wnyc-web-client/mirage/utils/serialize';

export default Factory.extend({
  id: '/',
  text() {
    let {
      id,
      testMarkup,
      body
    } = this,
      wormholes,
      json,
      type,
      slug;

    if (/^(shows|articles|tags)/.test(id)) {
      type = 'channel';
    } else if (/^story/.test(id)) {
      type = 'story';
    } else if (id === '/') {
      type = 'home';
    } else {
      type = 'legacy';
    }

    if (type === 'channel') {
      json = serialize(server.schema.listingPages.find(id));
      wormholes = '<div id="js-listings"></div>';
    } else if (type === 'story') {
      slug = id.match(/^story\/([^\/]+)\//)[1];

      let story = server.schema.stories.where({slug});
      if (!story.models.length) {
        story = server.create('story', {slug});
      } else {
        story = story.models[0];
      }
      server.createList('comment', 5, {story});
      server.createList('story', 5, {related: story});

      json = serialize(server.schema.stories.where({slug}).models[0]);
      wormholes = `
        <div class="l-full">
          <div class="l-constrained">
            <main id="main">
              <article>
                <header>
                <div class="flag nudge">
                <div id="edit-story"></div>
                </div>
                <button class="btn btn--blue btn--large js-listen" 
                  data-id="${story.id}" data-category="Listen" 
                  data-ember-component="listen-button.embedded"
                  data-ember-args='{ "itemPK": "${story.id}", "itemTitle": "${story.title}", "duration": "${story.audioDurationReadable}", "playContext": "story-header", "type": "blue-boss" }'>
                    <i class="fa fa-play icon--prefix--large"></i>Listen <span class="text--small dimmed">${story.audioDurationReadable}</span>
                </button>

                </header>
                <section class="text">${body}</section>
              </article>
            </main>
          </div>
          <div class="l-constrained">
            <div id="related"></div><div id="comments"></comments>
          </div>
        </div>`;
    } else if (type === 'home') {
      wormholes = `
        <div id="stream-banner" class="clearfix"></div>
      `;
    } else if (type === 'legacy') {

    }

    return `
      <div id="header">
        <form method="GET" action="/search/" id="search-form" class="promoted-layer animate-transforms"
          data-ember-component="embedded.header-search-field">
          <input id="search-input" name="q" class="promoted-layer animate-transforms js-animate-input"
            data-input="#search-input"
            data-classTarget="#search-wrapper">
          <label for="search-input" class="promoted-layer animate-opacity js-animate-input"
            data-input="#search-input"
            data-classTarget="#search-wrapper">Search</label>
        </form>
      </div>
      ${testMarkup || ''}
      ${wormholes || ''}
      <script type="text/x-wnyc-marker" data-url="${id}"></script>
      <script id="wnyc-${type}-jsonapi" type="application/vnd.api+json">
        ${JSON.stringify(json)}
      </script>
    `;
  }
});
