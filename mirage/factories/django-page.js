import { Factory } from 'ember-cli-mirage';
import serialize from 'overhaul/mirage/utils/serialize';

export default Factory.extend({
  id: '/',
  text() {
    let {id, slug} = this;
    let wormholes;
    let json;
    let content;
    let type;

    if (/^(shows|articles|tags)/.test(id)) {
      type = 'channel';
    } else if (/^story/.test(id)) {
      type = 'story';
    } else {
      type = 'legacy';
    }

    if (type === 'channel') {
      let {data} = serialize(server.schema.show.find(id));
      let arId = `${id}${data.attributes.linkroll[0].navSlug}/1`;

      server.create('api-response', {
        id: arId,
        type: data.attributes.firstPage
      });

      let ar = serialize(server.schema.apiResponse.find(arId));
      json = {
        data,
        included: ar.included ? ar.included.concat(ar.data) : []
      };
      wormholes = '<div id="js-listings"></div>';
    } else if (type === 'story') {
      json = serialize(server.schema.story.where({slug})[0]);
      wormholes = '<div id="related"></div><div id="comments"></comments>';
    } else if (type === 'legacy') {

    }

    return `
      ${wormholes || ''}
      <script type="text/x-wnyc-marker" data-url="${id}"></script>
      <script id="wnyc-${type}-jsonapi" type="application/vnd.api+json">
        ${JSON.stringify(json)}
      </script>
    `
  }
});
