import  User from './userSchema';
import {
  GraphQLString,
} from 'graphql';

const data = require('./../../../../../data.json');

export default {
  user: {
    type: User,
    args: {
      id: { type: GraphQLString }
    },
    async resolve(_, args: Object): Object {
      return data[args.id];
    }
  }
};
