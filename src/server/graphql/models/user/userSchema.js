import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  }
});
export default User;
