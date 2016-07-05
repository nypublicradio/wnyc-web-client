import { Factory } from 'ember-cli-mirage';
import serialize from 'overhaul/mirage/utils/serialize';

export default Factory.extend({
  id: '/',
  text() {
    let { id } = this,
      wormholes,
      json,
      content,
      type,
      slug,
      testMarkup = this.testMarkup;

    if (/^(shows|articles|tags)/.test(id)) {
      type = 'channel';
    } else if (/^story/.test(id)) {
      type = 'story';
    } else {
      type = 'legacy';
    }

    if (type === 'channel') {

      let {data} = serialize(server.schema.shows.find(id));
      let arId = `${id}${data.attributes.linkroll[0].navSlug}/1`;
      let apiResponse = server.schema.apiResponses.find(arId);
      if (!apiResponse) {
        let type = data.attributes.firstPage;
        let attrs = { id: arId, type };

        if (type === 'list') {
          attrs.teaseList = server.createList('story', 50);
        } else if (type === 'story') {
          attrs.story = server.create('story');
        }
        server.create('api-response', attrs);
        apiResponse = server.schema.apiResponses.find(arId);
      }
      apiResponse = serialize(apiResponse);

      json = {
        data,
        included: apiResponse.included ? apiResponse.included.concat(apiResponse.data) : []
      };
      wormholes = '<div id="js-listings"></div>';
    } else if (type === 'story') {
      slug = id.match(/^story\/([^\/]+)\//)[1];

      let story = server.create('story', {slug});
      server.createList('comment', 5, {story});
      server.createList('story', 5, {story});

      json = serialize(server.schema.stories.where({slug}).models[0]);
      wormholes = `
        <div class="l-full"></div>
        <div class="l-constrained">
          <div id="related"></div><div id="comments"></comments>
        </div>`;
    } else if (type === 'legacy') {

    }

    return `
      <div id="header"></div>
      ${testMarkup || ''}
      ${wormholes || ''}
      <script type="text/x-wnyc-marker" data-url="${id}"></script>
      <script id="wnyc-${type}-jsonapi" type="application/vnd.api+json">
        ${JSON.stringify(json)}
      </script>
    `;
  }
});
