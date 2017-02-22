export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.

    Make sure to define a factory for each model you want to create.
  */
   server.create('django-page', {
     id: '/'
   });
   server.createList('show', 100);

   server.create('user');
   server.createList('stream', 7);

}
