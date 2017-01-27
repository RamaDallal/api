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
import jwt from 'jsonwebtoken';

const home = (req: Object, res: Object): Object => res.sendStatus(200);
setupDB(config.db);

const app = express();
app.use(passport.initialize());
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
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
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/'
  }),
  function(req, res, profile) {
    const token = jwt.sign({ id: profile.id }, config.jwt.secretKey);
    res.redirect(`http://localhost:3000/?token=${token}`);
  }
);
app.use('/*', home);
app.listen(process.env.PORT || 3030);
passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'email', 'photos']
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({
      'providerId': profile.id
    }, (err, user) => {
      if (err)
        return done(err);
      if (user) {
        console.log('--------SERVER--------');
        console.log({ id: user.id });
        console.log(config.jwt.secretKey);
        const token = jwt.sign({ id: user.id }, config.jwt.secretKey);
        console.log(token);
        const toke = jwt.verify(token, config.jwt.secretKey);
        console.log(toke);
        return done(err, user, token);
      }
      user = new User({
        email: profile._json.email,
        providerType: 'Facebook',
        providerId: profile.id

      });

      user.save((err) => {
        console.log('c');
        console.log(user);
        if (err) {
          console.log(err);
          return done(null, false, {message: 'Windows Live login failed, email already used by other login strategy'});
        } else {
          return done(err, user);
        }
      });
    });
  }
));

