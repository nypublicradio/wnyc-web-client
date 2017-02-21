import { dasherize } from 'ember-string';

const slugify = str => dasherize(str.replace(/[^\w\s]/gi, '-'));

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

   let topics = ["Arts", "Books & Literature", "Business", "Education", "Environment", "Food", "Health", "History", "Media", "Movies", "Music", "Music:Classical", "Music:Opera", "Movies", "News:Local", "News:National", "News:World", "Parenting", "Poetry", "Pop Culture", "Religion & Faith", "Science", "Sports", "Storytelling", "Technology", "Transportation"];

   topics.forEach(t => {
     server.create('discover-topic', {title: t, url: slugify(t)});
   });

   server.createList('discover-story', 20);
   server.create('user');
   server.createList('stream', 7);

}
