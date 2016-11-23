/*
 main.js
 @flow
 */

import graphqlHTTP from 'express-graphql';
import express from 'express';
import Schema from './graphql/rootSchema';

const home = (req: Object, res: Object): Object => res.sendStatus(200);

express()
  .use('/api/graphql', graphqlHTTP({ schema: Schema, graphiql: true, pretty: true, raw: true }))
  .use('/*', home)
  .listen(3030);
