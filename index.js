const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const Credential = require('./src/model/credentials')
const Investment = require('./src/model/investment')
const 

mongoose.connect("mongodb://localhost/test5");

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"));
});
