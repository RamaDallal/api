import User from './userSchema';
import {
  GraphQLString,
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const data = require('./../../../../../data.json');

export default {
  signup: {
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
  login: {
    type: new ObjectType({
      name: 'CreateUserResult',
      fields: {
        errors: { type: new List(StringType) },
        user: { type: User },
      }
    }),
    args: {
      id: { type: GraphQLString },
      password: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => {
      let res;
      if (data[args.id] && data[args.id].password === args.password) {
        res = { user: data[args.id] };
      } else {
        res = { errors: ['invalid id,password'] };
      }
      return res;
    }
  }
};
