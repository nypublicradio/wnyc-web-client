export default function mirageSerializeModel(model) {
  return server.serializerOrRegistry.serialize(model);
}
