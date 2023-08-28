const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScema = new Schema({
  firstname: { type: String },
  surname: { type: String },
  username: { type: String },
  email: { type: String },
  address: {type: String},
  password: { type: String },
  isadmin: {type: Boolean, default: false }
});

const userCollection = mongoose.model("users", userScema);

module.exports = userCollection;
