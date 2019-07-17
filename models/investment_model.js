const mongoose = require("mongoose");
const Schema = mongoose.Schema

const InvestmentsSchema = new Schema({
  propertyData: [
    {
      price: {
        income: String,
        expenses: String,
        value: String,
        rio: String
      },
      address: {
        state: String,
        postcode: String,
        suburb: String,
        street: String,
        number: String
      },
      media: [
        {
          url: String
        }
      ],
      description: String,
      id: String
    }
  ]
});

const InvestmentModel = mongoose.model("Investment", InvestmentsSchema);

module.exports = { InvestmentModel, InvestmentsSchema };
