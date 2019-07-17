const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const Investment = module.exports = mongoose.model('Investment', investmentsSchema)

const investmentsSchema = new Schema({
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
            }],
        description: String,
        id: String
        }
    ]
});