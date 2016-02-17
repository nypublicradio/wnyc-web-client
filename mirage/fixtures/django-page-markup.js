function getHead(type) {
  return `
    <!DOCTYPE html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>
        WNYC | New York Public Radio, Podcasts, Live Streaming Radio, News
      </title>
      <link rel="stylesheet" type="text/css" media="all" href="/media/css/reset.css" />
    `
}
function template(type) {
  let head = getHead(type);
  let body = getBody(type);
  let footer = getFooter(type);
  return `
    <!DOCTYPE html>
    <html>
    <head>
    ${head}
    </head>
    <body>
    ${body}
    ${footer}
    </body>
    </html>
    `
}

export default function(type) {
  return template(type)
}
