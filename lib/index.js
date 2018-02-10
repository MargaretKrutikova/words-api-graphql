const { nodeEnv } = require('./util');
console.log(`Running in ${nodeEnv} mode...`);

const cors = require('cors');

// requrie express function and execute it to initialize the application
const app = require('express')();

// small helper library to handle user requests with those 3 steps:
// 1. extract the query
// 2. execute it against the schema
// 3. respond back to the user using the execution result
const graphqlHTTP = require('express-graphql'); // function ready to be plugged into the express route
const ncSchema = require('../schema');

// connect to mongodb
const { MongoClient } = require('mongodb');
const assert = require('assert');

// select the configuration for the current node environment
const mConfig = require('../config/mongo')[nodeEnv];

MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);

  app.use(cors());

  // define an endpoint route using middleware
  app.use('/graphql', (req, res) => {
    // lifetime of a request
    graphqlHTTP({
      schema: ncSchema,
      // enables local editor
      graphiql: true,
      context: { mPool }
    })(req, res);
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});