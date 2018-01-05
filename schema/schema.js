const graphql = require('graphql')
const axios = require('axios')

// deconstruct
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, // takes in a root query and returns a GraphQL schema
} = graphql

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
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
