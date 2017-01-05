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
import emailConfirmation from './emailConfirmation';

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
      user.isAuthenticated = false;
      user.password = hash;
      const nodeMailerOptions = {
        options: {
          auth: {
            api_key: config.nodeMailer.auth.api_key
          }
        }
      };
      const transporter = nodemailer.createTransport(sgTransport(nodeMailerOptions));
      return transporter.templateSender(emailConfirmation, function(error){
        if(error){
          console.log(error);
        }else{
          console.log('every thing is okay');
        }
        return user.save();
      });
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
      username: { type: GraphQLString },
      password: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => new Promise((resolve) => {
      UserModel.findOne({ username: args.username }, (usernameError, user) => {
        if (usernameError || !user) return resolve({ errors: ['invalid username'] });
        if (user.isAuthenticated === false) return resolve({ errors: ['please confirm your email'] });
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
              token,
            };
          }
          return resolve(res);
        });
      });
    })
  }
};
