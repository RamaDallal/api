/**
 * Created by Rama on 4/30/2017.
 */
const faker = require('faker');
const _ = require('lodash');
var dateFormat=require('dateformat');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://srn6gu3ejy:zx8cu0gkk3@first-cluster-4999098602.eu-west-1.bonsaisearch.net',
  log: 'trace'
});

 for(var i=30; i<=35;i++){
 
 
 client.index({
 index: 'resto',
 type: 'restaurant',
 id :i,
 body: {
 
 "name": faker.name.findName(),
 "description": faker.name.findName(),
 "image": faker.image.avatar(),
 "open_hour":dateFormat( faker.date.past(),"HH:mm") ,
 "close_hour":dateFormat( faker.date.past(),"HH:mm") ,
 "city": faker. address.streetName(),
 "country": faker.address.streetName(),
 "area": faker.address.streetName()
 }
 
 });
 
 }
 
 
 