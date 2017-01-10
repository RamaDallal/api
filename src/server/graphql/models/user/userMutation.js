import User from './userSchema';
import UserModel from './UserModel';
import {
  GraphQLString,
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default {
  signup: {
    type: User,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.password, salt);
      const user = new UserModel();
      user.email = args.email;
      user.password = hash;
      return user.save();
    }
  },
  login: {
    type: new ObjectType({
      name: 'CreateUserResult',
      fields: {
        errors: { type: new List(StringType) },
        user: { type: User },
        token: { type: GraphQLString }
      }
    }),
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => new Promise((resolve) => {
      UserModel.findOne({ email: args.email }, (emailError, user) => {
        if (emailError || !user) return resolve({ errors: ['invalid email'] });
        return bcrypt.compare(args.password, user.password, (passwordError, result) => {
          let res;
          if (!result) {
            res = { errors: ['Invalid password'] };
          } else if (passwordError) {
            res = { errors: [passwordError] };
          } else {
            const token = jwt.sign({ id: user.id }, 'super_secret');
            res = {
              user,
              token
            };
          }
          return resolve(res);
        });
      });
    })
  },
  changePassword: {
    type: new ObjectType({
      name: 'ChangePasswordResult',
      fields: {
        errors: { type: new List(StringType) },
        user: { type: User }
      }
    }),
    args: {
      password: { type: GraphQLString },
      newPassword: { type: GraphQLString },
      token: { type: GraphQLString }
    },
    resolve: (_, args:Object):Object => new Promise((resolve) => {
      var decoded = jwt.decode(args.token, 'super_secret');
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.newPassword, salt);
      UserModel.findOne({ _id: decoded.id }, function (err, user) {
        return bcrypt.compare(args.password, user.password,(passwordError, result) => {
          let res;
          if (!result) {
            res = { errors: ['Invalid password'] };
          } else if (passwordError) {
            res = { errors: [passwordError] };
          } else  {
            UserModel.update({
              _id: decoded.id
            }, {password: hash}, function () {
              res = {
                user
              };
              return resolve(res);
            });
          }
        });
      });
    })
  }
};
