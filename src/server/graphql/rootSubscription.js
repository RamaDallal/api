import {
  GraphQLObjectType
} from 'graphql';

const rootFields = Object.assign();

export default new GraphQLObjectType({
  name: 'RootSubscription',
  fields: () => rootFields
});

