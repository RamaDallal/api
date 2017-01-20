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

const home = (req: Object, res: Object): Object => res.sendStatus(200);
setupDB(config.db);

const app = express();
app.use('/api/graphql/confirm', (req, res) => {
  User.update({ _id: req.query.id }, { isAuthenticated: true }, (err, user) => {
    if (err) throw err;

    if (!user) {
      return res.status(403).send({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      res.json({ success: true, message: 'Welcome in the member area ' });
    }
  });
});
app.use('/api/graphql', cors(),
  graphqlHTTP({ schema: Schema, graphiql: true, pretty: true, raw: true
  }));
app.route('/auth/facebook').get(passport.authenticate('facebook', {
  scope: 'email'
}));
app.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', (err, user, info) => {
     console.log(err, user, info);
  }));
app.use('/*', home);
app.listen(process.env.PORT || 3030);

const fbOpts = {
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: config.facebookAuth.callbackURL,
  profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'email', 'photos']
};
const fbCallback = (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    console.log(accessToken, refreshToken, profile, done);
    User.findOne({ "providerId ": profile.id }, (err, user) => {
      if (err)
        return done(err);
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User();
        newUser.providerType = 'Facebook';
        newUser.providerId = profile.id;
        newUser.email = profile._json.email;
        newUser.save((err) => {
          if (err)
            throw err;
            return done(null, newUser);
        });
      }
    });
  });
};

passport.use(new FacebookStrategy(fbOpts, fbCallback));

