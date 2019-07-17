const mongoose = require("mongoose");

const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:4000", { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const Investment = mongoose.model('Investment', investmentsSchema)
const Credential = mongoose.model('Credential', credentialsSchema)

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

const credentialsSchema = new Schema({
  email: String,
  password: String
});
