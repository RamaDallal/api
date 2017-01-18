/*
 main.js
 @flow
 */

import graphqlHTTP from 'express-graphql';
import express from 'express';
import Schema from './graphql/rootSchema';
import setupDB from './database/setupDB';
import config from './../../config';
const cors = require('cors');
import User from './graphql/models/user/UserModel';
import FacebookStrategy from 'passport-facebook';
import passport from 'passport';
import bodyParser from 'body-parser';


setupDB(config.db);

var app = express();
app.listen(3030);
app.use(bodyParser.json());

app.route('/auth/facebook').get(passport.authenticate('facebook', {
  scope: ['email']
}));
app.route('/auth/facebook/callback').get(passport.authenticate('facebook', function(err, user, info) {
  console.log(err, user, info);
}));

var fbOpts = {
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: config.facebookAuth.callbackURL,
  profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'email', 'photos']
};
var fbCallback = function(access_token, refresh_token, profile, done) {
  process.nextTick(function() {
    console.log(access_token, refresh_token, profile, done);
    User.findOne({ "id": profile.id }, function(err, user) {
      if (err)
        return done(err);
      if (user) {
        return done(null, user);
      } else {//      console.log('verifys');
        const newUser = new User();
        newUser.facebook.id = profile.id;
        newUser.facebook.email = profile._json.email;
        newUser.save(function(err) {
          if (err)
            throw err;
          return done(null, newUser);
        });
      }
    });
  });
};

passport.use(new FacebookStrategy(fbOpts, fbCallback));

