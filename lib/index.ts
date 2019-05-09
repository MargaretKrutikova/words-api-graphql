import assert from "assert"
import cors from "cors"
import express from "express"
import "./env"

// small helper library to handle user requests with those 3 steps:
// 1. extract the query
// 2. execute it against the schema
// 3. respond back to the user using the execution result
import graphqlHTTP from "express-graphql" // function ready to be plugged into the express route
import { MongoClient, MongoError } from "mongodb"

import config from "./config/mongo"
import ncSchema from "./schema"
import { nodeEnv } from "./util"

console.log(`Running in ${nodeEnv} mode...`)

// Create Express server
const app = express()

// select the configuration for the current node environment
const url = config.url!
assert.notEqual(url, undefined)

// connect to mongodb
MongoClient.connect(
  url,
  { useNewUrlParser: true },
  (err: MongoError, mPool: MongoClient) => {
    assert.equal(err, null)

    app.use(cors())

    // define an endpoint route using middleware
    app.use("/graphql", (req, res) => {
      // lifetime of a request
      graphqlHTTP({
        schema: ncSchema,
        // enables local editor
        graphiql: true,
        context: { mPool }
      })(req, res)
    })

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`)
    })
  }
)
