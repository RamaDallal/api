import graphql from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';
const data = require('./data.json');

const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    children: {
      type: new graphql.GraphQLList(graphql.GraphQLString),
      args: { limit: { type: graphql.GraphQLInt } },
      resolve: (user, args) => {
        return user.children;
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        // `args` describes the arguments that the `user` query accepts
        args: {
          id: { type: graphql.GraphQLString }
        },
        resolve: (_, args, context) => {
          return data[args.id];
        }
      }
    }
  }),
  mutation: new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
      AddUser: {
        type: userType,
        args: {
          id: { type: graphql.GraphQLString },
          name: { type: graphql.GraphQLString }
        },
        resolve: (_, args) => {
          data[args.id] = { name: args.name, id: args.id };
          return data[args.id];
        }
      },
      RemoveUser: {
        type: userType,
        args: {
          id: { type: graphql.GraphQLString },
          name: { type: graphql.GraphQLString }
        },
        resolve: (_, args) => {
          data[args.id] = { name: args.name, id: args.id };
          return data[args.id];
        }
      }
    }
  })
});

const home = (req, res) => {
  return res.sendStatus(200);
}
express()
  .use('/api/graphql', graphqlHTTP({ schema: schema, graphiql: true, pretty: true, raw: true }))
  .use('/*', home)
  .listen(3030);

console.log('GraphQL server running on http://localhost:3030/api/graphql');