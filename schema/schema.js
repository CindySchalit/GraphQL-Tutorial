const graphql = require('graphql')
const _ = require('lodash')

// deconstruct
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, // takes in a root query and returns a GraphQL schema
} = graphql

const users = [
  { id: '23', firstName: 'Bill', age: 20 },
  { id: '47', firstName: 'Samantha', age: 21 }
]

const UserType = new GraphQLObjectType({
  name: 'User',
  // what properties User has, what data type each property is
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  }
})

// root query = go to a specific node in the data/graph
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // give me a user id, i will give you back a User
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      // go into data and look for what we want
      resolve(parentValue, args) {
        return _.find(users, { id: args.id })
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
