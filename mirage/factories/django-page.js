import { Factory } from 'ember-cli-mirage';
import { documentTemplate } from 'overhaul/tests/helpers/html';

export default Factory.extend({
  id: '/',
  text() {
    let id = this.id;
    return `
      <html>
        <head></head>
        <body>
          <script type="text/x-wnyc-marker" data-url="${id}"></script>
        </body>
      </html>
    `
  }
});
