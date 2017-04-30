const faker = require('faker');
const _ = require('lodash');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://srn6gu3ejy:zx8cu0gkk3@first-cluster-4999098602.eu-west-1.bonsaisearch.net',
  log: 'trace'
});
_.range(1, 100).map(function() {
  const restaurant = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar()
  };
  console.log(restaurant);
  // client.insert(restaurant);
})

