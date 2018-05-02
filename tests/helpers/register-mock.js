export function registerAndInjectMock(owner, registryName, mockObject, injectionName) {
  // if we're using a fake name, we can simply register and inject.
  owner.register(registryName, mockObject);
  owner.inject('controller', injectionName, registryName);
  owner.inject('route',      injectionName, registryName);
  owner.inject('component',  injectionName, registryName);
  return owner.lookup(registryName);
}

export function registerMockOnInstance(owner, registryName, mockObject) {
  // If we're trying to ovverride a real name, (e.g. because we want to fool an
  // initializer that uses instance.lookup('foo:bar')) things get trickier;
  //
  // application.register('foo:bar', bar) won't replace the real registered factory.
  // application.unregister('foo:bar') won't fully remove it from all registrys, fallback registrys
  // and registry caches.
  //
  // We use this deprecated api here to replace the object directly with our own mock
  //
  // based on: https://github.com/ember-weekend/ember-weekend/blob/master/tests/helpers/module-for-acceptance.js#L14
  owner.register(registryName, mockObject);
  return owner.lookup(registryName);
}
