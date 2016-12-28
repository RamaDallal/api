import {
  GraphQLObjectType
} from 'graphql';
import user from './models/user/userQuery';

const rootFields = Object.assign(user);

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => rootFields
});
