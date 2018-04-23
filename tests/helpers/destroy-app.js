import { run } from '@ember/runloop';

export default function destroyApp(application) {
  run(application, 'destroy');
  if (typeof server !== 'undefined') {
    server.shutdown();
  }
}
