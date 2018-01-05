const express = require('express')
// expressGraphQL is glue layer between GraphQL and express
const expressGraphQL = require('express-graphql')
const schema = require('./schema/schema')

const app = express()

// pass request to GraphQL
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true // for use in development only
}))

app.listen(4000, () => {
  console.log('Listening')
})
