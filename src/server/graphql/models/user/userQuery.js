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
      const { id } = ctx.headers.authorization ? jwt.verify(ctx.headers.authorization, 'super_secret') : { id: null };
      return UserModel.findById(id);
    }
  }
};
