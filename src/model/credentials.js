const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Credential = module.exports = mongoose.model('Credential', credentialSchema)

const credentialSchema = new Schema({
    email: String,
    password: String
  });
  
