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
client.search({
  
  index: 'resto',
  type: 'restaurant',
  body: {
    query: {
      match_all: {  }
    },
  }
},function (error, response,status) {
  if (error){
    console.log("search error: "+error)
  }
  else {
   
    response.hits.hits.forEach(function(hit){
      console.log(hit);
    })
  }
});
