import User from './userSchema';
import {
  GraphQLString,
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

import UserModel from './userModel';

export default {
  signup: {
    type: User,
    args: {
      username: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => {
      console.log('123');
      const user = new UserModel();
      user.username = args.username;
      user.password = 'xxx';
      console.log(user);
      return user.save();
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
      username: { type: GraphQLString },
      password: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ username: args.username, password: args.password }, (err, user) => {
          let res;
          if (err) {
            res = { errors: ['error'] };
          } else {
            res = { user };
          }
          return resolve(res);
        });
      });
    }
  }
};
