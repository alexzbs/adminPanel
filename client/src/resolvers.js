import gql from 'graphql-tag';

export const typeDefs = gql`

type Route {
  path: String!
  exact: Boolean!
}

  extend type Query {
    isLoggedIn: Boolean!
  }

  extend type Role {
    routes: [Route!]! 
  }

`;

export const resolvers = {};