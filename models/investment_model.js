const mongoose = require("mongoose");
const Schema = mongoose.Schema


const InvestmentSchema = new Schema({
      price: {
        income: String,
        expenses: String,
        value: String,
        rio: String,
        displayPrice: String
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
      propertyid: String,
      userid: String
});

const InvestmentModel = mongoose.model("investment", InvestmentSchema);

module.exports = mongoose.model('Investment', InvestmentSchema);