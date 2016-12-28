import {
  GraphQLObjectType
} from 'graphql';
import user from './models/user/userMutation';

const rootFields = Object.assign(user);

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => rootFields
});
