import User from './userSchema';
import UserModel from './userModel';
import {
  GraphQLString,
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

import bcrypt from 'bcryptjs';


export default {
  signup: {
    type: User,
    args: {
      username: { type: GraphQLString },
      password: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.password, salt);
      const user = new UserModel();
      user.username = args.username;
      user.password = hash;
      return user.save();
    }
  },
  login: {
    type: new ObjectType({
      name: 'CreateUserResult',
      fields: {
        errors: { type: new List(StringType) },
        user: { type: User }
      }
    }),
    args: {
      username: { type: GraphQLString },
      password: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => new Promise((resolve) => {
      UserModel.findOne({ username: args.username }, (usernameError, user) => {
        if (usernameError || !user) return resolve({ errors: ['invalid username'] });
        return bcrypt.compare(args.password, user.password, (passwordError, result) => {
          let res;
          if (!result) {
            res = { errors: ['Invalid password'] };
          } else if (passwordError) {
            res = { errors: [passwordError] };
          } else {
            res = { user };
          }
          return resolve(res);
        });
      });
    })
  }
};
