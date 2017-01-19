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

const home = (req:Object, res:Object):Object => res.sendStatus(200);
setupDB(config.db);

var app = express();
app.use('/api/graphql/confirm', function(req, res) {
  User.update({ _id: req.query.id }, { isAuthenticated: true }, function(err, user) {
    if (err) throw err;

    if (!user) {
      return res.status(403).send({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      res.json({ success: true, message: 'Welcome in the member area ' });
    }
  });
});
app.use('/api/graphql', cors(), graphqlHTTP({ schema: Schema, graphiql: true, pretty: true, raw: true }));
app.route('/auth/facebook').get(passport.authenticate('facebook', {
  scope: 'email'
}));
app.route('/auth/facebook/callback').get(passport.authenticate('facebook', function(err, user, info) {
  console.log(err, user, info);
}));
app.use('/*', home);
app.listen(process.env.PORT || 3030);

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
      } else {
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

