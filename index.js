const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/test5");

const usersSchema = new Schema({
  email: String,
  password: String
});

const investmentsSchema = new Schema({
  pricingId: String,
  addressId: String,
  description: String
});

const pricingSchema = new Schema({
  price: String,
  date: String
});

const addressesSchema = new Schema({
  state: String,
  postcode: String,
  suburb: String,
  street: String,
  number: String
});

const Investment = mongoose.model("Investment", investmentsSchema);

const User = mongoose.model("User", usersSchema);

const Pricing = mongoose.model("Pricing", pricingSchema);

const Address = mongoose.model("Address", addressesSchema);

const typeDefs = `
  type Query {
    allInvestments: [Investment!]!
    getInvestment(investmentId: String!): Investment
    userInvestments(userId: String!): [Investment!]!
    allUsers: [User!]!
    allPricings: [Pricing!]!
    allAddresses: [Address!]!
  }
  type Pricing {
    id: ID!
    investmentId: ID!
    price: String!
    date: String!
  }
  type Address {
    id: ID!
    investmentId: ID!
    state: String!
    postcode: String!
    suburb: String!
    street: String!
    number: String!
  }
  type Investment {
      id: ID!
      address: Address!
      description: String!
      pricing: Pricing!
  }
  type User {
    id: ID!
    email: String!
    password: String!
    investments: [Investment]
  }
  type Mutation {
    createInvestment(
      addressId: String
      pricingId: String
      description: String
    ): Investment
        
    createAddress(
      state: String
      postcode: String
      suburb: String
      street: String
      number: String
    ): Address

    createPricing(
      price: String!
      date: String!
    ): Pricing
  

    updateInvestment(
      id: ID!
      addressId: ID!
      pricingId: ID!
      description: String
    ): Boolean

    removeInvestment(investmentId: ID!): Boolean

    createUser(email: String!, password: String!): User
    updateUser(userId: ID!, email: String!, password: String!): Boolean
    removeUser(userId: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    allInvestments: () => Investment.find(),
    allUsers: () => User.find(),
    allPricings: () => Pricing.find(),
    allAddresses: () => Address.find(),
  },
  Mutation: {
    createInvestment: async (_, { pricingId, addressId, description }) => {
      const investment = new Investment({
        pricingId,
        addressId,
        description
      });
      await investment.save();
      return investment;
    },
    updateInvestment: async (
      _,
      { investmentId, pricingId, addressId, description }
    ) => {
      await Investment.findByIdAndUpdate(investmentId, {
        pricingId,
        addressId,
        description
      });
      return true;
    },
    removeInvestment: async (_, { investmentId }) => {
      await Investment.findByIdAndRemove(investmentId);
      return true;
    },
    createUser: async (_, { email, password }) => {
      const user = new User({ email, password });
      await user.save();
      return user;
    },
    updateUser: async (_, { userId, password }) => {
      await User.findByIdAndUpdate(userId, { email, password });
      return true;
    },
    removeUser: async (_, { userId }) => {
      await User.findByIdAndRemove(userId);
      return true;
    },
    createPricing: async (_, { price, date }) => {
      const pricing = new Pricing({ price, date });
      await pricing.save();
      return pricing;
    },
    createAddress: async (
      _,
      { investmentId, state, postcode, suburb, street, number }
    ) => {
      const address = new Address({
        investmentId,
        state,
        postcode,
        suburb,
        street,
        number
      });
      await address.save();
      return address;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"));
});
