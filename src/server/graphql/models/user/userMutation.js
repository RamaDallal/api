import User from './userSchema';
import {
  GraphQLString,
} from 'graphql';

const data = require('./../../../../../data.json');

export default {
  AddUser: {
    type: User,
    args: {
      id: { type: GraphQLString },
      name: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => {
      data[args.id] = { name: args.name, id: args.id };
      return data[args.id];
    }
  },
  RemoveUser: {
    type: User,
    args: {
      id: { type: GraphQLString },
      name: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => {
      data[args.id] = { name: args.name, id: args.id };
      return data[args.id];
    }
  }
};
