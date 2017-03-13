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
import multer from 'multer';
import AWS from 'aws-sdk';
import bodyParser from 'body-parser';
import fs from 'fs';
import waterfall from 'async-waterfall';

const upload = multer({ dest: 'src/server/uploads' });

const home = (req: Object, res: Object): Object => res.sendStatus(200);
setupDB(config.db);

const app = express();
app.use(bodyParser.json());
app.use(express.static('src/server/uploads'));
app.set('view engine', 'ejs');
app.use('/api/graphql/confirm', (req, res) => {
  User.update({ _id: req.query.id }, { isAuthenticated: true }, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(403).send(
        { success: false, message: 'Authentication failed. User not found.' });
    } else {
      res.json({ success: true, message: 'Welcome in the member area ' });
    }
  });
});
app.use('/api/graphql', cors(),
  graphqlHTTP({ schema: Schema, graphiql: true, pretty: true, raw: true
  }));

app.use(passport.initialize());
passport.use(new FacebookStrategy({
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: config.facebookAuth.callbackURL,
  profileFields: ['id', 'name', 'gender', 'displayName', 'picture.height(150).width(150)', 'profileUrl', 'email']
},
  (accessToken, refreshToken, profile, done) => {
    User.findOne({
      providerId: profile.id
    }, (err, user) => {
      if(err)
        return done(err);
      if(user)
        return done(null, user);
      else {
        const newUser = new User();
        newUser.email = profile._json.email,
        newUser.providerType = 'Facebook',
        newUser.providerId = profile.id,
        newUser.avatar = profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
        newUser.displayName = profile._json.name,
          newUser.save(() => {
            if (err)
              throw err;
            return done(null, newUser);
          });
      }
    });
  }
));

app.get('/auth/facebook', passport.authenticate('facebook', {
  display: 'popup',
  session: false,
  scope: ['email', 'public_profile']
}));
app.get('/auth/facebook/callback', (req, res, next) =>
  passport.authenticate('facebook', (err, user) => err ? res.status(400).send(err) :
  res.render('auth-callback', {
    token: {
      token: jwt.sign({
        email: user.email,
        id: user.id
      }, config.jwt.secretKey)
    }
  }))(req, res, next));

AWS.config.update({
  secretAccessKey: 'tmJi4pV4em7bxEAdGLv1vlvH1gV+Bo7qvcD1sTNh',
  accessKeyId: 'AKIAIJD67AKHPDOBXPCQ',
  sslEnabled: true
});

const s3 = new AWS.S3();

app.post('/upload', upload.single('photo'), (req, res) => {
  waterfall([
    (callback) => {
      s3.putObject({
        Bucket: 'pazarnext',
        Key: `uploads/images/${req.file.filename}`,
        Body: fs.createReadStream(__dirname + '/uploads/' + req.file.filename),
        ACL: 'public-read',
        ContentType: req.file.mimetype
      }, (err) => {
        callback(err)
      })
    },
    (callback) => {
      fs.unlink(`src/server/uploads/${req.file.filename}`, (err) => {
        callback(err, `https://s3.amazonaws.com/${config.bucket}/uploads/images/${req.file.filename}`)
      })
    }
  ], (err, amazonUrl) => {
    if (err) return res.status(400).send(err);
    res.send({ amazonUrl });
  });
});
app.use('/*', home);
app.listen(process.env.PORT || 3030);
