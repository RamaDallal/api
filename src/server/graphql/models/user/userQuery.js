import User from './userSchema';
import {
  GraphQLString,
} from 'graphql';

import UserModel from './UserModel';

export default {
  user: {
    type: User,
    args: {
      id: { type: GraphQLString }
    },
    async resolve(_, args: Object): Object {
      return UserModel.findById(args.id);
    }
  }
};
