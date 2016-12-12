import RSVP from 'rsvp';
import $ from 'jquery';

export default function(options) {
  return new RSVP.Promise((resolve, reject) => {
    $.ajax(options)
    .done(d => resolve(d))
    .fail(jqXHR => {
      var error = new Error(jqXHR.statusText);
      error.response = jqXHR;
      reject(error);
    });
  });
}
