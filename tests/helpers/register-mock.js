export function registerAndInjectMock(application, registryName, mockObject, injectionName) {
  // if we're using a fake name, we can simply register and inject.
  application.register(registryName, mockObject);
  application.inject('controller', injectionName, registryName);
  application.inject('route',      injectionName, registryName);
  application.inject('component',  injectionName, registryName);
  return application.__container__.lookup(registryName);
}

export function registerMockOnInstance(application, registryName, mockObject) {
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
  let instance = application.__deprecatedInstance__;
  let registry = instance.register ? instance : instance.registry;
  registry.register(registryName, mockObject);
  return application.__container__.lookup(registryName);
}
