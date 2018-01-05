const graphql = require('graphql')
const axios = require('axios')

// deconstruct
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, // takes in a root query and returns a GraphQL schema
  GraphQLList,
  GraphQLNonNull,
} = graphql

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  // closure - wrap object in function so can resolve all types, then execute. otherwise circular reference as to CompanyType and UserType
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType), // list because multiple users
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data)
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  // what properties User has, what data type each property is
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { // associate company with user
      type: CompanyType, // self defined type
      // get the company associated with a user
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data)
      }
    }
  })
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
          .then(res => res.data)
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data) // will resolve with record that was just created by post request
      }
    },
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType, // type of data we will return from resolve function
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) }, // non null as in must provide this info
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, age }) {
        return axios.post('http://localhost:3000/users', { firstName, age})
          .then(res => res.data)
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data)
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parentValue, { id, firstName, age }) {
        return axios.patch(`http://localhost:3000/users/${id}`, { firstName, age } )
          .then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
