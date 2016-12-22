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
      username: {type: GraphQLString},
      password: {type: GraphQLString}
    },
    resolve: (_, args:Object):Object => {
      console.log('123');
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(args.password, salt);
      const user = new UserModel();
      user.username = args.username;
      user.password = hash;
      console.log(user);
      console.log(hash);
      return user.save();
    }
  },
  login: {
    type: new ObjectType({
      name: 'CreateUserResult',
      fields: {
        errors: {type: new List(StringType)},
        user: {type: User}
      }
    }),
    args: {
      username: {type: GraphQLString},
      password: {type: GraphQLString}
    },
    resolve: (_, args:Object):Object => {
      return new Promise((resolve, reject) => {
        UserModel.findOne({username: args.username}, (err, user) => {
          if (!user) {
            console.log('x');
          } else {
            console.log('2');
            bcrypt.compare(args.password, user.password, function (err, result) {
              console.log('3');
              console.log(user.password);
              let res;
              if (!result) {
                res = {errors: ['error']};
                console.log('error');
              } else {
                console.log('5');
                console.log('success');
                res = {user};
              }
              return resolve(res);
            });
          }
        });
      });
    }
  }
};
