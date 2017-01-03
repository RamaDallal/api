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
      password: { type: GraphQLString },
      isAuthenticated: { type: GraphQLString }
    },
    resolve: (_, args: Object): Object => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.password, salt);
      const user = new UserModel();
      user.email = args.email;
      user.password = hash;
      user.isAuthenticated = false;
      const options = {
        auth: {
          api_key: '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'
        }
      };
      const client = nodemailer.createTransport(sgTransport(options));

      const link = 'http://localhost:3030/api/graphql/confirm?id=' + user.id;
      const email = {
        from: 'awesome@bar.com',
        to: [args.email, 'sammour.ma7moud@gmail.com'],
        subject: 'Hello',
        text: 'Hello {{username}}',
        html: '<b><a href="' + link + '">Confirm Link</a> </b>'
      };
      client.sendMail(email, function (error) {
        if (error) {
          console.log(error);
        }
        else {
          console.log('Every thing is Oky');
        }
      });
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
              token,
            };
          }
          return resolve(res);
        });
      });
    })
  }
};
