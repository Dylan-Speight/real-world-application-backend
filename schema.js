const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/test5");

// const credentialsSchema = new Schema({
//     email: String,
//     password: String

// })

// const investmentsSchema = new Schema({
//     propertyData: {
//         price: String,
//         address: {
//             state: String,
//             postcode: String,
//             suburb: String,
//             street: String,
//             number: String
//         },
//         media: [],
//         description: String,
//         pricing: {
//             date: String
//         }

//     }
// })

const Investment = mongoose.model("Investment", {
  propertyData: {
    price: String,
    address: {
      state: String,
      postcode: String,
      suburb: String,
      street: String,
      number: String
    },
    media: [],
    description: String,
    pricing: {
      date: String
    }
  }
});

const Credentials = mongoose.model("Credential", {
  email: String,
  password: String
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    investments: [Investment]
    pricing: [Pricing]
    address: [Address]
    propertyData: [PropertyData]
    credentials: [Credential]
  }
  type Investment {
      id: ID!
      propertyData: [PropertyData]
  }
  type PropertyData {
    price: String!
    address: [Address]
    media: []
    description: String
    pricing: [Pricing]
  }
  type Pricing {
    date: String
  }
  type Address {
    state: String
    postcode: String
    suburb: String
    street: String
    number: String
  }
  type Credential {
    id: ID!
    email: String!
    password: String!
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
// createAddress(text: String!): Address
// updateAddress(id: ID!): Boolean
// removeAddress(id: ID!): Boolean

// createPricing(text: String!): Pricing
// updatePricing(id: ID!): Boolean
// removePricing(id: ID!): Boolean

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    investments: () => Investment.find(),
    credentials: () => Credential.find()
  },
  Mutation: {
    createInvestment: async (_, { propertyData }) => {
      const investment = new Investment({ propertyData });
      await investment.save();
      return investment;
    },
    updateInvestment: async (_, { id, propertyData }) => {
      await Investment.findByIdAndUpdate(id, { propertyData });
      return true;
    },
    removeInvestment: async (_, { id }) => {
      await Investment.findByIdAndRemove(id);
      return true;
    },
    createCredential: async (_, { email, password, postcode }) => {
      const credential = new Credentials({ email, password, postcode });
      await credential.save();
      return credential;
    },
    updateCredential: async (_, { id, password, postcode}) => {
        await Credential.findByIdAndUpdate(id, {password, postcode})
        return true
    },
    removeCredential: async (_, { id }) => {
        await Credential.findByIdAndRemove
        return true
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"));
});
