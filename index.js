const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test5");

const Investment = mongoose.model("Investment", {
  text: String,
  complete: Boolean
});

const User = mongoose.model("User", {
  email: String,
  password: String,
  postcode: String
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    investments: [Investment]
    users: [User]
}
  type Investment {
      id: ID!
      text: String!
      complete: Boolean
  }
  type User {
    id: ID!
    email: String!
    password: String!
    postcode: String
  }
  type Mutation {
      createInvestment(text: String!): Investment
      updateInvestment(id: ID!, complete: Boolean): Boolean
      removeInvestment(id: ID!): Boolean

      createUser(email: String!): User
      updateUser(id: ID!, complete: Boolean): Boolean
      removeUser(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    investments: () => Investment.find(),
    users: () => User.find()
  },
  Mutation: {
    createInvestment: async (_, { text }) => {
      const investment = new Investment({ text, complete: false });
      await investment.save();
      return investment;
    },
    updateInvestment: async (_, { id, complete }) => {
      await Investment.findByIdAndUpdate(id, { complete });
      return true;
    },
    removeInvestment: async (_, { id }) => {
      await Investment.findByIdAndRemove(id);
      return true;
    },
    createUser: async (_, { email, password, postcode }) => {
      const user = new User({ email, password, postcode });
      await user.save();
      return user;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"));
});
