import User from './userSchema';
import UserModel from './UserModel';
import {
  GraphQLString,
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';
import config from '../../../../../config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signUpConfirmEmail, forgottenPasswordEmail } from '../../../email-service/emailService';

export default {
  signup: {
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
      password: { type: GraphQLString },
      isAuthenticated: { type: GraphQLString }
    },
    resolve: (_, args:Object):Object => new Promise((resolve) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.password, salt);
      const user = new UserModel();
      user.email = args.email;
      user.password = hash;
      user.isAuthenticated = false;
      signUpConfirmEmail(user, (err) => {
        if (!err) {
          user.save((userErr, userInfo) => {
            if (!userErr) {
              resolve({ user: userInfo });
            } else {
              resolve({ errors: [userErr] });
            }
          });
        } else {
          resolve({ errors: [err] });
        }
      });
    })
  },
  login: {
    type: new ObjectType({
      name: 'LoginUserResult',
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
    resolve: (_, args:Object):Object => new Promise((resolve) => {
      UserModel.findOne({ email: args.email }, (emailError, user) => {
        if (emailError || !user) return resolve({ errors: ['invalid email'] });
        if (user.isAuthenticated === false) return resolve(
          { errors: ['please confirm your email'] });
        return bcrypt.compare(args.password, user.password, (passwordError, result) => {
          let res;
          if (!result) {
            res = { errors: ['Invalid password'] };
          } else if (passwordError) {
            res = { errors: [passwordError] };
          } else {
            const token = jwt.sign({ id: user.id }, config.jwt.secretKey);
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
    },
    resolve: (_, args:Object, context:Object):Object => new Promise((resolve) => {
      const token = context.headers.authorization;
      const decoded = jwt.decode(token, config.jwt.secretKey);
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.newPassword, salt);
      UserModel.findOne({ _id: decoded.id }, (err, user) => {
        return bcrypt.compare(args.password, user.password, (passwordError, result) => {
          let res;
          if (!result) {
            res = { errors: ['Invalid password'] };
            return resolve(res);
          } else if (passwordError) {
            res = { errors: [passwordError] };
            return resolve(res);
          } else {
            UserModel.update({
              _id: decoded.id
            }, { password: hash }, () => {
              res = {
                user
              };
              return resolve(res);
            });
          }
        });
      });
    })
  },
  forgottenPassword: {
    type: new ObjectType({
      name: 'ForgottenPasswordResult',
      fields: {
        errors: { type: new List(StringType) },
        user: { type: User }
      }
    }),
    args: {
      email: { type: GraphQLString }
    },
    resolve: (_, args:Object):Object => new Promise((resolve) => {
      UserModel.findOne({ email: args.email }, (emailError, user) => {
        if (emailError || !user) return resolve({ errors: ['invalid email'] });
        forgottenPasswordEmail(user, (err) => {
          if (err) {
            console.log('error');
          } else {
            resolve({ user: [user] });
          }
        });
      });
    })
  },
  resetPassword: {
    type: new ObjectType({
      name: 'ResetPasswordResult',
      fields: {
        errors: { type: new List(StringType) },
        user: { type: User }
      }
    }),
    args: {
      newPassword: { type: GraphQLString },
      token: { type: GraphQLString }
    },
    resolve: (_, args:Object):Object => new Promise((resolve) => {
      const decoded = jwt.decode(args.token, config.jwt.secretKey);
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.newPassword, salt);
      UserModel.findOne({ email: decoded.email }, (err, user) => {
        let res;
        if (!user) {
          res = { errors: ['Invalid password'] };
        } else if (err) {
          res = { errors: [err] };
        } else {
          UserModel.update({
            email: decoded.email
          }, { password: hash }, () => {
            res = {
              user
            };
            return resolve(res);
          });
        }
      });
    })
  },
  accountSetting: {
    type: new ObjectType({
      name: 'AccountSettingResult',
      fields: {
        errors: { type: new List(StringType) },
      }
    }),
    args: {
      displayName: { type: GraphQLString }
    },
    resolve: (_, args:Object, context:Object):Object => new Promise((resolve) => {
      const token = context.headers.authorization;
      const decoded = jwt.decode(token, config.jwt.secretKey);
      UserModel.findOne({ _id: decoded.id }, (err, user) => {
        let res;
        if (!user) {
          res = { errors: ['Invalid password'] };
        } else if (err) {
          res = { errors: [err] };
        } else {
          UserModel.update({
            email: decoded.email
          }, { displayName: args.displayName }, () => {
            res = {
              user
            };
            return resolve(res);
          });
        }
      });
    })
  }
};

