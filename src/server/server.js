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

const home = (req: Object, res: Object): Object => res.sendStatus(200);

setupDB(config.db);

express()
  .use('/api/graphql', cors(), graphqlHTTP({ schema: Schema, graphiql: true, pretty: true, raw: true }))
  .use('/*', home)
  .listen(3030);
