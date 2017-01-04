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

const home = (req: Object, res: Object): Object => res.sendStatus(200);

setupDB(config.db);

express()
  .use('/api/graphql/confirm', function (req, res) {
    User.update({_id: req.query.id}, {isAuthenticated: true}, function (err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, message: 'Authentication failed. User not found.'});
      } else {
        res.json({success: true, message: 'Welcome in the member area '});
      }
    });
  })
  .use('/api/graphql', cors(), graphqlHTTP({ schema: Schema, graphiql: true, pretty: true, raw: true }))
  .use('/*', home)
  .listen(process.env.PORT || 3030);
