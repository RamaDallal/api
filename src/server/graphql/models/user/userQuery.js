import User from './userSchema';
import {
  GraphQLString,
} from 'graphql';

import UserModel from './userModel';
import jwt from 'jsonwebtoken';
import isEmpty from 'lodash/isEmpty';

export default {
  user: {
    type: User,
    async resolve(_, args: Object, ctx): Object {
      let id = null;
      if (!isEmpty(ctx.headers.authorization) && ctx.headers.authorization !== 'null') {
        id = jwt.verify(ctx.headers.authorization, 'super_secret').id;
      }
      return UserModel.findById(id);
    }
  }
};
