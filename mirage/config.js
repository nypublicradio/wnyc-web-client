export default function() {
  this.get('/api/v3/channel/:apiRequestId', function(schema, request) {
    let apiRequestId = decodeURIComponent(request.params.apiRequestId);
    let apiRequest = schema.apiResponse.find(apiRequestId);
    return jsonpResponse(this, apiRequest);
  });
}

function jsonpResponse(server, model) {
  let payload = server.serializerOrRegistry.serialize(model);
  return `WNYC(${JSON.stringify(payload)})`;
}
