import User from './userSchema';
import {
  GraphQLString,
} from 'graphql';

import UserModel from './userModel';
import jwt from 'jsonwebtoken';

export default {
  user: {
    type: User,
    async resolve(_, args: Object, ctx): Object {
      console.log(ctx.headers.authorization);
      const { id } = jwt.verify(ctx.headers.authorization, 'super_secret');
      return UserModel.findById(id);
    }
  }
};
