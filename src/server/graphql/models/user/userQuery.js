import User from './userSchema';

import jwt from 'jsonwebtoken';
import isEmpty from 'lodash/isEmpty';
import UserModel from './UserModel';
import config from '../../../../../config.js';

export default {
  user: {
    type: User,
    async resolve(_, args: Object, ctx): Object {
      let id = null;
      if (!isEmpty(ctx.headers.authorization) && ctx.headers.authorization !== 'null') {
        id = jwt.verify(ctx.headers.authorization, config.jwt.secretKey).id;
      }
      return UserModel.findById(id);
    }
  }
};
