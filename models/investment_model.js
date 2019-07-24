const mongoose = require("mongoose");
const Schema = mongoose.Schema
var uniqueValidator = require('mongoose-unique-validator');

const InvestmentSchema = new Schema({
      price: {
        displayPrice: String,
        estimatedProfit: String,
        monthlyRepayments: String
      },
      address: {
        displayableAddress: String,
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
      propertyid: {type: String, unique: true},
      userid: String
});

InvestmentSchema.plugin(uniqueValidator);

const InvestmentModel = mongoose.model("investment", InvestmentSchema);

module.exports = mongoose.model('Investment', InvestmentSchema);