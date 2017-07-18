export default function(code) {
  if (!code) {
    /* eslint-disable */
    console.warn('no analytics string supplied');
    /* eslint-enable */
    return {};
  }
  // see puppy/cms/models/content.py#analytics_code_string for fields
  const fields = ['slug', 'audio', 'audioduration', 'video', 'modelchar', 'domainint', 'hasshow', 'haschannel', 'isblog', 'seriestitles', 'channeltitle', 'showtitle', 'tags', 'audiopath'];
  const REGEX = /(?:.*:)?(.*)\W+\$A(\d)\$AD(\d+)\$V(\d)\$M(\w)\$D(\d+)\$HS(\d)\$HC(\d)\$B(\d)\$SS([^$]+)\$C([^$]*)\$S([^$]*)\$T([^$]+)\$AP([^$]+)\$$/;
  let match = code.match(REGEX);
  if (!match) {
    /* eslint-disable */
    console.warn('failure processing analytics code');
    /* eslint-enable */
    return {};
  } else {
    match = match.slice(1);
  }
  const analyticsObject = {};

  const boolFields = ['audio', 'video', 'haschannel', 'hasshow', 'isblog'];
  const numFields = ['audioduration', 'domainint'];
  const arrayFields = {tags: '!', seriestitles: '+'};

  for (let i = 0; i < fields.length; i++) {
    let field = fields[i];
    if (boolFields.includes(field)) {
      analyticsObject[field] = match[i] === "1";
    } else if (numFields.includes(field)) {
      analyticsObject[field] = Number(match[i]);
    } else if (Object.keys(arrayFields).includes(field)) {
      analyticsObject[field] = match[i].split(arrayFields[field]).reject(i => !i);
    } else {
      analyticsObject[field] = match[i];
    }
  }

  return analyticsObject;
}
