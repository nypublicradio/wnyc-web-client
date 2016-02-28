import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
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
