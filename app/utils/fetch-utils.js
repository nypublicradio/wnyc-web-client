import RSVP from 'rsvp';

/*  fetch() doesn't reject promises for requests that
    succeed but have http error codes. If we want that behavior
    we can use this `rejectUnsuccessfulResponse` function.

    fetch(url)
    .then(rejectUnsuccessfulResponse)
    .then(doSomethingElseWithResponse)
    .catch(dealWithBadResponsesAndOtherErrors);
*/
export function rejectUnsuccessfulResponses(response) {
  return new RSVP.Promise(function(resolve, reject) {
    if (response && response.ok) {
      resolve(response);
    } else {
      if (response.json) {
        response.json().then((r) => {
          reject(r);
        });
      } else {
        reject(response);
      }
    }
  });
}
